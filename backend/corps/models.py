from django.db import models
import PyPDF2
import docx
import win32com.client
import pythoncom 
import os
from django.utils.timezone import now
class TypeCorps(models.Model):
    nom = models.CharField(max_length=100,unique=True,null=True)

    def __str__(self):
        return self.nom
class Corps(models.Model):
    STATUS_CHOICES = [
        ('actif', 'Actif'),
        ('inactif', 'Inactif'),
    ]

    CORPS_PROFESSIONNELS = [
        ('Administration Publique', 'Administration Publique'),
        ('Administration Judiciaire', 'Administration Judiciaire'),
        ('Administration Pénitentiaire', 'Administration Pénitentiaire'),
        ('Agriculture-Elevage-Pêche', 'Agriculture-Elevage-Pêche'),
        ('Chercheur Enseignant', 'Chercheur Enseignant'),
        ('Communication médiatisée', 'Communication médiatisée'),
        ('Diplomatie', 'Diplomatie'),
        ('Domaine-Topographie', 'Domaine-Topographie'),
        ('Environnement-Eaux-Forêts', 'Environnement-Eaux-Forêts'),
        ('Éducation de base et Enseignement secondaire', 'Éducation de base et Enseignement secondaire'),
        ('Énergie-Mines-Ressources', 'Énergie-Mines-Ressources'),
        ('Économie-Finances-Plan', 'Économie-Finances-Plan'),
        ('Inspection de l’Etat', 'Inspection de l’Etat'),
        ('Forces Armées', 'Forces Armées'),
        ('Jeunesse-Sports', 'Jeunesse-Sports'),
        ('Météorologie', 'Météorologie'),
        ('Planification', 'Planification'),
        ('Police nationale', 'Police nationale'),
        ('Poste-Télécommunications', 'Poste-Télécommunications'),
        ('Travail-Lois Sociales', 'Travail-Lois Sociales'),
        ('Corps transversaux', 'Corps transversaux'),
        ('Travaux publics-Habitat-Aménagement', 'Travaux publics-Habitat-Aménagement'),
        ('Transports', 'Transports'),
        ('Santé Publique', 'Santé Publique'),
    ]

    nom = models.CharField(
        max_length=255,
        choices=CORPS_PROFESSIONNELS,  # Liste déroulante à partir des corps professionnels
        null=True,
        blank=True,
    )
    numero = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    type = models.ForeignKey(TypeCorps,on_delete=models.SET_NULL, null=True,blank=True)
    date_creation = models.DateField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES,null=True)
    fichier = models.FileField(upload_to='documents/',null=True)
    pdf_file = models.FileField(upload_to='pdf_documents/', null=True, blank=True)
    visits = models.PositiveIntegerField(default=0,verbose_name='nombre de visite')
    telechargements = models.PositiveIntegerField(default=0)

    def increment_visits(self):
        self.visits += 1
        self.save()
    def increment_telechargements(self):
        self.telechargements += 1
        self.save()

    def __str__(self):
        return self.nom
    def convert_to_pdf(self):
        if not self.fichier.name.endswith('.docx'):
            raise ValueError("La conversion en PDF est uniquement prise en charge pour les fichiers .docx.")

        input_path = self.fichier.path
        media_root = os.path.dirname(os.path.dirname(input_path))
        output_dir = os.path.join(media_root, 'pdf_documents')
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, os.path.basename(input_path).replace('.docx', '.pdf'))

        try:
            pythoncom.CoInitialize()
            word = win32com.client.Dispatch("Word.Application")
            doc = word.Documents.Open(input_path)
            doc.SaveAs(output_path, FileFormat=17)
            doc.Close()
            word.Quit()

            self.pdf_file.name = os.path.relpath(output_path, media_root)
            self.save()

        except Exception as e:
            raise ValueError(f"Erreur lors de la conversion : {e}")


        return output_path  # Retourne le chemin absolu du fichier PDF


        
    def extract_content(self):
        if self.fichier.name.endswith('.pdf'):
            try:
                with self.fichier.open('rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    return ''.join(page.extract_text() for page in reader.pages)
            except Exception as e:
                return f"Error reading PDF: {e}"
        elif self.fichier.name.endswith(('.doc', '.docx')):
            try:
                with self.fichier.open('rb') as f:
                    doc = docx.Document(f)
                    return '\n'.join(p.text for p in doc.paragraphs)
            except Exception as e:
                return f"Error reading DOC/DOCX: {e}"
        return "Unsupported file type."

class CorpsStats(models.Model):
    date = models.DateField(default=now)  # Date de l'ajout
    daily_count = models.IntegerField(default=0)  # Nombre d'ajouts par jour
    monthly_count = models.IntegerField(default=0)  # Nombre d'ajouts par mois
    yearly_count = models.IntegerField(default=0)  # Nombre d'ajouts par année

    class Meta:
        verbose_name_plural = "Corps Statistics"

