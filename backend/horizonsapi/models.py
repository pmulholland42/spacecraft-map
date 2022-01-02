from django.db import models

# Create your models here.

class OrbitalBody(models.Model):
    name = models.CharField(max_length=100)
    id = models.IntegerField(primary_key=True)

class OrbitalPosition(models.Model):
    orbital_body = models.ForeignKey(OrbitalBody, on_delete=models.CASCADE)
    time = models.DateTimeField()
    semimajor_axis = models.DecimalField(decimal_places=8, max_digits=18)
    eccentricity = models.DecimalField(decimal_places=8, max_digits=18)
    inclination = models.DecimalField(decimal_places=8, max_digits=18)
    meanLongitude = models.DecimalField(decimal_places=8, max_digits=18)
    longitudeOfPeriapsis = models.DecimalField(decimal_places=8, max_digits=18)
    longitudeOfAscendingNode = models.DecimalField(decimal_places=8, max_digits=18)

