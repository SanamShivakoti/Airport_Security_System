# Generated by Django 4.1.13 on 2024-01-21 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Airport_Security', '0012_staff_faces_alter_staff_face_id_delete_face'),
    ]

    operations = [
        migrations.AddField(
            model_name='staff',
            name='staff_id',
            field=models.CharField(default='S1234', max_length=5),
            preserve_default=False,
        ),
    ]
