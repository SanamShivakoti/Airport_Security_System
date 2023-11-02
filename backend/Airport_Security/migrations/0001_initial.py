# Generated by Django 4.1.12 on 2023-10-12 03:28

import Airport_Security.utils
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Role',
            fields=[
                ('role_id', models.CharField(default=Airport_Security.utils.generate_role_id, max_length=5, primary_key=True, serialize=False, unique=True)),
                ('role_name', models.CharField(choices=[('Admin', 'Admin'), ('User', 'User')], default='User', max_length=5)),
            ],
        ),
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('user_id', models.CharField(default=Airport_Security.utils.generate_user_id, max_length=5, primary_key=True, serialize=False, unique=True)),
                ('first_name', models.CharField(max_length=50)),
                ('middle_name', models.CharField(blank=True, max_length=50, null=True)),
                ('last_name', models.CharField(max_length=50)),
                ('email', models.EmailField(max_length=254)),
                ('mobile_number', models.CharField(max_length=15)),
                ('password', models.CharField(max_length=128)),
                ('status', models.CharField(choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active', max_length=8)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('created_time', models.TimeField(auto_now_add=True)),
                ('role_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Airport_Security.role')),
            ],
        ),
    ]