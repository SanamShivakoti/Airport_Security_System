# Generated by Django 4.2.6 on 2023-11-06 16:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Airport_Security', '0002_alter_user_email_alter_user_user_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='user_id',
            field=models.CharField(default='U6329', max_length=5, primary_key=True, serialize=False, unique=True),
        ),
    ]