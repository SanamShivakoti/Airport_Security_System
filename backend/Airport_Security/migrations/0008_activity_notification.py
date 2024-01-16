# Generated by Django 4.1.13 on 2024-01-09 19:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Airport_Security', '0007_alter_user_email'),
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('activity_id', models.AutoField(primary_key=True, serialize=False)),
                ('activity_description', models.TextField()),
                ('role', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('notification_id', models.AutoField(primary_key=True, serialize=False)),
                ('notification_name', models.CharField(max_length=255)),
                ('notification_description', models.TextField()),
                ('role', models.CharField(max_length=50)),
            ],
        ),
    ]