# Generated by Django 4.2.16 on 2024-12-10 11:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0004_remove_document_pdf_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='domaine',
            field=models.ForeignKey(blank=True, default='aucun', null=True, on_delete=django.db.models.deletion.CASCADE, to='documents.domaine'),
        ),
    ]
