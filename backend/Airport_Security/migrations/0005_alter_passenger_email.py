# Generated by Django 4.1.13 on 2024-01-06 11:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Airport_Security', '0004_alter_passenger_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='passenger',
            name='email',
            field=models.EmailField(max_length=255, unique=True, verbose_name='Email'),
        ),
    ]
