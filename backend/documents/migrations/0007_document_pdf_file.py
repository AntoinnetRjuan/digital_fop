# Generated by Django 4.2.16 on 2024-12-14 18:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0006_alter_document_domaine'),
    ]

    operations = [
        migrations.AddField(
            model_name='document',
            name='pdf_file',
            field=models.FileField(blank=True, null=True, upload_to='pdf_documents/'),
        ),
    ]
