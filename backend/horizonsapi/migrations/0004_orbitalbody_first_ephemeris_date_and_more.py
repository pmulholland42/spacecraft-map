# Generated by Django 4.0 on 2023-03-05 16:44

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('horizonsapi', '0003_orbitalposition_center_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='orbitalbody',
            name='first_ephemeris_date',
            field=models.DateTimeField(default=datetime.datetime(1, 1, 1, 0, 0, tzinfo=utc)),
        ),
        migrations.AddField(
            model_name='orbitalbody',
            name='last_ephemeris_date',
            field=models.DateTimeField(default=datetime.datetime(9999, 12, 31, 23, 59, 59, 999999, tzinfo=utc)),
        ),
    ]