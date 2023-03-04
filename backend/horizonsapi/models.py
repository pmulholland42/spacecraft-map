from django.db import models
from django.core.serializers.json import DjangoJSONEncoder
import decimal

# Create your models here.


class OrbitalBody(models.Model):
    name = models.CharField(max_length=100)
    id = models.IntegerField(primary_key=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"


class OrbitalPosition(models.Model):
    orbital_body = models.ForeignKey(OrbitalBody, on_delete=models.CASCADE)
    center = models.CharField(max_length=20)
    time = models.DateTimeField()
    semimajor_axis = models.DecimalField(decimal_places=8, max_digits=18)
    eccentricity = models.DecimalField(decimal_places=8, max_digits=18)
    inclination = models.DecimalField(decimal_places=8, max_digits=18)
    mean_longitude = models.DecimalField(decimal_places=8, max_digits=18)
    longitude_of_periapsis = models.DecimalField(decimal_places=8, max_digits=18)
    longitude_of_ascending_node = models.DecimalField(decimal_places=8, max_digits=18)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["orbital_body", "center", "time"],
                name="unique_orbital_position",
            )
        ]

    def __str__(self):
        return f"""{self.orbital_body}
center = {self.center}
time = {self.time}
semi-major axis = {self.semimajor_axis} AU
eccentricity = {self.eccentricity}
inclination = {self.inclination} degrees
mean longitude = {self.mean_longitude} degrees
longitude of periapsis = {self.longitude_of_periapsis} degrees
longitude of ascending node = {self.longitude_of_ascending_node} degrees
        """


class OrbitalPositionEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        return super().default(obj)
