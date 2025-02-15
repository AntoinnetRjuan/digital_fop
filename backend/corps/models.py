from django.db import models
import PyPDF2
import docx
import win32com.client
import pythoncom 
import os
from django.utils.timezone import now
import hashlib
from django.core.exceptions import ValidationError
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
        ('Chercheur enseignant et Enseignement chercheur', 'Chercheur Enseignant et Enseignement chercheur'),
        ('Communication médiatisée', 'Communication médiatisée'),
        ('Diplomatie', 'Diplomatie'),
        ('Domaine-Topographie', 'Domaine-Topographie'),
        ('Environnement Eaux et Forêts', 'Environnement Eaux et Forêts'),
        ('Éducation de base et Enseignement secondaire', 'Éducation de base et Enseignement secondaire'),
        ('Énergie, Mines et Ressources', 'Énergie-Mines-Ressources'),
        ('Économie, Finances et Plan', 'Économie, Finances et Plan'),
        ('Inspection de l\'Etat', 'Inspection de l\'Etat'),
        ('Forces Armées', 'Forces Armées'),
        ('Jeunesse et Sports', 'Jeunesse et Sports'),
        ('Météorologie', 'Météorologie'),
        ('Planification', 'Planification'),
        ('Police nationale', 'Police nationale'),
        ('Poste et Télécommunications', 'Poste et Télécommunications'),
        ('Travail et Lois Sociales', 'Travail et Lois Sociales'),
        ('Corps transversaux', 'Corps transversaux'),
        ('Travaux publics, Habitat et Aménagement', 'Travaux publics, Habitat et Aménagement'),
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
        Corps.objects.filter(id=self.id).update(visits=models.F('visits') + 1)

    def increment_telechargements(self):
        Corps.objects.filter(id=self.id).update(telechargements=models.F('telechargements') + 1)
    def save(self, *args, **kwargs):
        # Vérifier si l'objet est en cours de création (pas de modification)
        if not self.pk:  # self.pk est None lors de la création
            if self.fichier:
                try:
                    print(f"Nom du fichier : {self.fichier.name}")  # Log pour vérifier le nom du fichier
                    print(f"Taille du fichier : {self.fichier.size}")  # Log pour vérifier la taille du fichier

                    # Calculer le hash du fichier
                    file_content = self.fichier.read()
                    file_hash = hashlib.sha256(file_content).hexdigest()
                    print(f"Hash calculé : {file_hash}")  # Log pour vérifier le hash

                    # Vérifier si un fichier avec le même hash existe déjà
                    for existing_doc in Corps.objects.all():
                        try:
                            existing_file_content = existing_doc.fichier.read()
                            existing_file_hash = hashlib.sha256(existing_file_content).hexdigest()
                            print(f"Hash du fichier existant ({existing_doc.fichier.name}) : {existing_file_hash}")  # Log pour vérifier les hashs existants
                            if file_hash == existing_file_hash:
                                raise ValidationError("Un fichier identique existe déjà.")
                            existing_doc.fichier.seek(0)  # Réinitialiser le fichier après la lecture
                        except FileNotFoundError:
                            print(f"Fichier manquant : {existing_doc.fichier.name}")  # Log pour les fichiers manquants
                            continue  # Ignorer les fichiers manquants

                    # Réinitialiser le fichier après la lecture
                    self.fichier.seek(0)

                except Exception as e:
                    print(f"Erreur lors de la vérification du fichier : {str(e)}")  # Log pour les erreurs
                    raise ValidationError(f"Erreur lors de la vérification du fichier : {str(e)}")

        # Appeler la méthode save() de la classe parente
        super().save(*args, **kwargs)

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

