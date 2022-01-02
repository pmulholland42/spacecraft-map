from django.shortcuts import render
from django.http import HttpResponse

import urllib.request

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
    result = fetch_elements_data(orbital_body_id, center, start_time, stop_time, step)
    return HttpResponse(result)


def fetch_elements_data(orbital_body_id, center, start_time, stop_time, step):
    url = "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND=" + orbital_body_id + "&OBJ_DATA=NO&MAKE_EPHEM=YES&EPHEM_TYPE=ELEMENTS&CENTER=" + center + "&START_TIME=" + start_time + "&STOP_TIME=" + stop_time + "&STEP_SIZE=" + step + "&QUANTITIES='1,9,20,23,24,29'&CSV_FORMAT=YES"
    with urllib.request.urlopen(url) as response:
        return response.read()

