# Generated by Django 4.1.13 on 2024-02-09 09:35

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('Airport_Security', '0015_notification_checked'),
    ]

    operations = [
        migrations.AddField(
            model_name='activity',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
