# Generated by Django 4.1.13 on 2024-01-06 11:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Airport_Security', '0002_face_passenger_staff'),
    ]

    operations = [
        migrations.AlterField(
            model_name='passenger',
            name='email',
            field=models.EmailField(max_length=255, verbose_name='Email'),
        ),
    ]
