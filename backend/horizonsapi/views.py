from django.http.response import HttpResponseServerError
from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers

from datetime import datetime

import urllib.request

from .models import OrbitalPosition, OrbitalBody

# Create your views here.

def index(request):
    return HttpResponse("Hello world!")

#, orbital_body_id, center, start_time, stop_time, step

def orbital_position(request):
    orbital_body_id = request.GET.get('orbital_body_id', '')
    center = request.GET.get('center', '')
    start_time = request.GET.get('start_time', '')
    stop_time = request.GET.get('stop_time', '')
    step = request.GET.get('step', '')

    OrbitalPosition.objects.all().delete()

    result = fetch_elements_data(orbital_body_id, center, start_time, stop_time, step)

    try:
        orbital_body = OrbitalBody.objects.get(id=orbital_body_id)
        print("got orbital body from db")
        print(orbital_body.id)
    except OrbitalBody.DoesNotExist:
        orbital_body = OrbitalBody()
        orbital_body.id = int(orbital_body_id)
        orbital_body.name = parse_name(result, orbital_body_id)
        orbital_body.save()
        print("got orbital body from http request")
        print(orbital_body.id)

    orbital_positions = parse_elements_data(result, orbital_body_id)

    for p in orbital_positions:
        p.save()

    serialized_data = serializers.serialize("json", orbital_positions)
    return HttpResponse(serialized_data)


def fetch_elements_data(orbital_body_id, center, start_time, stop_time, step):
    url = "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND=" + orbital_body_id + "&OBJ_DATA=NO&MAKE_EPHEM=YES&EPHEM_TYPE=ELEMENTS&CENTER=" + center + "&START_TIME=" + start_time + "&STOP_TIME=" + stop_time + "&STEP_SIZE=" + step + "&QUANTITIES='1,9,20,23,24,29'&CSV_FORMAT=YES&OUT_UNITS=AU-D"
    with urllib.request.urlopen(url) as response:
        return response.read()

def parse_elements_data(response, orbital_body_id):
    lines = response.split(b'\n')
    reading_elements = False
    orbital_positions = list()
    for line in lines:
        if b'$$EOE' in line:
            break

        elif reading_elements:
            elements = line.split(b',')
            orbital_position = OrbitalPosition()
            orbital_position.orbital_body_id = orbital_body_id
            orbital_position.time = datetime.strptime(elements[1].decode("utf-8").strip(), "A.D. %Y-%b-%d %H:%M:%S.0000")
            orbital_position.semimajor_axis = float(elements[11])
            orbital_position.eccentricity = float(elements[2])
            orbital_position.inclination = float(elements[4])
            argument_of_periapsis = float(elements[6])
            mean_anomaly = float(elements[9])
            orbital_position.longitude_of_ascending_node = float(elements[5])
            orbital_position.mean_longitude = orbital_position.longitude_of_ascending_node + argument_of_periapsis + mean_anomaly
            orbital_position.longitude_of_periapsis = orbital_position.longitude_of_ascending_node + argument_of_periapsis
            orbital_positions.append(orbital_position)

        elif b'$$SOE' in line:
            reading_elements = True

    return orbital_positions

def parse_name(response, orbital_body_id):
    lines = response.split(b'\n')
    for line in lines:
        if b'Target body name: ' in line:
            line_info = line.decode("utf-8").split("Target body name: ", 1)[1].strip()
            name = line_info.split(" (" + orbital_body_id + ") ")[0].strip()
            if (name.endswith(")")):
                name = name.rpartition("(")[0].strip()
            return name

def get_orbital_body(id):
    return OrbitalBody.objects.filter(id=id).first()


