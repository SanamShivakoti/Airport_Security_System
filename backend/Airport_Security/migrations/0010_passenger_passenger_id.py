# Generated by Django 4.1.13 on 2024-01-11 15:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Airport_Security', '0009_user_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='passenger',
            name='passenger_id',
            field=models.CharField(default='test', max_length=5),
            preserve_default=False,
        ),
    ]
