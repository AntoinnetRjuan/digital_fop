# Generated by Django 4.2.16 on 2025-01-25 16:58

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('corps', '0004_alter_corps_nom'),
    ]

    operations = [
        migrations.CreateModel(
            name='CorpsStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('daily_count', models.IntegerField(default=0)),
                ('monthly_count', models.IntegerField(default=0)),
                ('yearly_count', models.IntegerField(default=0)),
            ],
            options={
                'verbose_name_plural': 'Corps Statistics',
            },
        ),
    ]
