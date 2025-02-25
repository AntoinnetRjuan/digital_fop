# Generated by Django 4.2.16 on 2025-01-21 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('corps', '0003_corps_pdf_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='corps',
            name='nom',
            field=models.CharField(blank=True, choices=[('Administration Publique', 'Administration Publique'), ('Administration Judiciaire', 'Administration Judiciaire'), ('Administration Pénitentiaire', 'Administration Pénitentiaire'), ('Agriculture-Elevage-Pêche', 'Agriculture-Elevage-Pêche'), ('Chercheur Enseignant', 'Chercheur Enseignant'), ('Communication médiatisée', 'Communication médiatisée'), ('Diplomatie', 'Diplomatie'), ('Domaine-Topographie', 'Domaine-Topographie'), ('Environnement-Eaux-Forêts', 'Environnement-Eaux-Forêts'), ('Éducation de base et Enseignement secondaire', 'Éducation de base et Enseignement secondaire'), ('Énergie-Mines-Ressources', 'Énergie-Mines-Ressources'), ('Économie-Finances-Plan', 'Économie-Finances-Plan'), ('Inspection de l’Etat', 'Inspection de l’Etat'), ('Forces Armées', 'Forces Armées'), ('Jeunesse-Sports', 'Jeunesse-Sports'), ('Météorologie', 'Météorologie'), ('Planification', 'Planification'), ('Police nationale', 'Police nationale'), ('Poste-Télécommunications', 'Poste-Télécommunications'), ('Travail-Lois Sociales', 'Travail-Lois Sociales'), ('Corps transversaux', 'Corps transversaux'), ('Travaux publics-Habitat-Aménagement', 'Travaux publics-Habitat-Aménagement'), ('Transports', 'Transports'), ('Santé Publique', 'Santé Publique')], max_length=255, null=True),
        ),
    ]
