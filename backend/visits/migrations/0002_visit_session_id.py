# Generated by Django 4.2.16 on 2025-01-25 10:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('visits', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='visit',
            name='session_id',
            field=models.CharField(max_length=255, null=True, unique=True),
        ),
    ]
