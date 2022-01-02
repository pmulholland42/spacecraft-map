from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('orbital_position/', views.orbital_position, name="orbital_position")
]