# Generated by Django 4.2.16 on 2024-12-18 19:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0010_actualite'),
    ]

    operations = [
        migrations.AlterField(
            model_name='actualite',
            name='conseil',
            field=models.CharField(choices=[('CONSEIL DE MINISTRE', 'Ministre'), ('CONSEIL DE GOUVERNEMENT', 'Gouvernement')], max_length=50),
        ),
    ]
