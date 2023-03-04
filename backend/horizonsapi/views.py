from django.http.response import HttpResponseServerError
from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.db import IntegrityError

from datetime import datetime
import pytz

import urllib.request

from .date_utils import (
    parse_step,
    round_datetime_down,
    round_datetime_up,
    generate_date_range,
)

from .models import OrbitalPosition, OrbitalBody


DATE_FORMAT = "%Y-%m-%dT%H:%M:%S"


class HttpResponseThen(HttpResponse):
    def __init__(self, data, then_callback, **kwargs):
        super().__init__(data, **kwargs)
        self.then_callback = then_callback

    def close(self):
        super().close()
        self.then_callback()


def index(request):
    return HttpResponse("Hello world!")


def orbital_position(request):
    orbital_body_id = request.GET.get("orbital_body_id", "")
    center = request.GET.get("center", "")
    start_time = request.GET.get("start_time", "")
    stop_time = request.GET.get("stop_time", "")
    step = request.GET.get("step", "")

    (skip, interval) = parse_step(step)

    start_time = pytz.utc.localize(datetime.strptime(start_time, DATE_FORMAT))
    stop_time = pytz.utc.localize(datetime.strptime(stop_time, DATE_FORMAT))
    start_time = round_datetime_down(start_time, interval)
    stop_time = round_datetime_up(stop_time, interval)

    orbital_body = None
    cache_miss = False
    orbital_positions = list()
    try:
        # Try to find this orbital body in our database.
        orbital_body = OrbitalBody.objects.get(id=orbital_body_id)

        # Try to find all the requested orbital position data in our database.
        cached_positions = OrbitalPosition.objects.filter(
            orbital_body_id=orbital_body_id, time__range=[start_time, stop_time]
        ).order_by("time")

        requested_date_range = generate_date_range(
            start_time, stop_time, interval, skip
        )

        cache_result = check_cached_positions(requested_date_range, cached_positions)
        if cache_result is None:
            cache_miss = True
        else:
            orbital_positions = cache_result

    except OrbitalBody.DoesNotExist:
        # If the orbital body doesn't exist, then we must not have any orbital position data for it yet.
        cache_miss = True

    if cache_miss:
        result = fetch_elements_data(
            orbital_body_id, center, start_time, stop_time, step
        )

        if orbital_body is None:
            create_orbital_body(orbital_body_id, result)

        orbital_positions = parse_elements_data(result, orbital_body_id)

    def response_callback():
        if cache_miss:
            cache_orbital_positions(orbital_positions)

    serialized_data = serializers.serialize("json", orbital_positions)
    return HttpResponseThen(serialized_data, response_callback)


def cache_orbital_positions(orbital_positions):
    insert_count = 0
    update_count = 0
    for new_position in orbital_positions:
        try:
            new_position.save()
            insert_count += 1
        except IntegrityError:
            # We already have data for this orbital position in the database.
            # The Horizons system may have more up-to-date data though.
            OrbitalPosition.objects.filter(
                orbital_body_id=new_position.orbital_body_id,
                center=new_position.center,
                time=new_position.time,
            ).update(
                eccentricity=new_position.eccentricity,
                inclination=new_position.inclination,
                longitude_of_ascending_node=new_position.longitude_of_ascending_node,
                longitude_of_periapsis=new_position.longitude_of_periapsis,
                mean_longitude=new_position.mean_longitude,
                semimajor_axis=new_position.semimajor_axis,
            )
            update_count += 1
    print(f"Updated {update_count} and inserted {insert_count}")


def check_cached_positions(requested_time_range, cached_orbital_positions):
    requested_orbital_positions = list()
    cache_index = 0
    for requested_date in requested_time_range:
        is_date_cached = False
        # Look through the query result for an orbital position with this date.
        # The query result may have more granular data than requested,
        # for example a position every minute when we want every hour.
        # So we have to keep looping through until we find the desired date.
        # This is possible because cached_positions is ordered by time.
        while True:
            if cache_index > len(cached_orbital_positions) - 1:
                # We've reached the end of the query result set
                break
            cached_position = cached_orbital_positions[cache_index]
            if requested_date == cached_position.time:
                is_date_cached = True
                requested_orbital_positions.append(cached_position)
                break

            cache_index += 1

        if not is_date_cached:
            return None

    return requested_orbital_positions


def fetch_elements_data(orbital_body_id, center, start_time, stop_time, step):
    url = (
        "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND="
        + orbital_body_id
        + "&OBJ_DATA=NO&MAKE_EPHEM=YES&EPHEM_TYPE=ELEMENTS&CENTER="
        + center
        + "&START_TIME="
        + start_time.strftime(DATE_FORMAT)
        + "&STOP_TIME="
        + stop_time.strftime(DATE_FORMAT)
        + "&STEP_SIZE="
        + step
        + "&QUANTITIES='1,9,20,23,24,29'&CSV_FORMAT=YES&OUT_UNITS=AU-D"
    )
    with urllib.request.urlopen(url) as response:
        return response.read()


def parse_elements_data(response, orbital_body_id):
    lines = response.split(b"\n")
    reading_elements = False
    orbital_positions = list()
    for line in lines:
        if b"$$EOE" in line:
            break

        elif reading_elements:
            elements = line.split(b",")
            orbital_position = OrbitalPosition()
            orbital_position.orbital_body_id = orbital_body_id
            orbital_position.time = pytz.utc.localize(
                datetime.strptime(
                    elements[1].decode("utf-8").strip(), "A.D. %Y-%b-%d %H:%M:%S.0000"
                )
            )
            orbital_position.semimajor_axis = float(elements[11])
            orbital_position.eccentricity = float(elements[2])
            orbital_position.inclination = float(elements[4])
            argument_of_periapsis = float(elements[6])
            mean_anomaly = float(elements[9])
            orbital_position.longitude_of_ascending_node = float(elements[5])
            orbital_position.mean_longitude = (
                orbital_position.longitude_of_ascending_node
                + argument_of_periapsis
                + mean_anomaly
            )
            orbital_position.longitude_of_periapsis = (
                orbital_position.longitude_of_ascending_node + argument_of_periapsis
            )
            orbital_positions.append(orbital_position)

        elif b"$$SOE" in line:
            reading_elements = True

    return orbital_positions


def parse_name(response, orbital_body_id):
    lines = response.split(b"\n")
    for line in lines:
        if b"Target body name: " in line:
            line_info = line.decode("utf-8").split("Target body name: ", 1)[1].strip()
            name = line_info.split(" (" + orbital_body_id + ") ")[0].strip()
            if name.endswith(")"):
                name = name.rpartition("(")[0].strip()
            return name


def create_orbital_body(orbital_body_id, horizons_result):
    orbital_body = OrbitalBody()
    orbital_body.id = int(orbital_body_id)
    orbital_body.name = parse_name(horizons_result, orbital_body_id)
    orbital_body.save()
