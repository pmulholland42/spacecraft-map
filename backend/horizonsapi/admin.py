from django.contrib import admin

from .models import OrbitalBody, OrbitalPosition

# Register your models here.
admin.site.register(OrbitalPosition)
admin.site.register(OrbitalBody)
