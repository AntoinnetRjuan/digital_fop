from django.db import models
import PyPDF2
import docx
import win32com.client
import pythoncom 
import os
class Domaine(models.Model):  # ou Theme
    nom = models.CharField(max_length=100, unique=True,null=True)

    def __str__(self):
        return self.nom
# Create your models here.
class Document(models.Model):
    TYPE_CHOICES = [
        ('constitution', 'Constitution'),
        ('traités internationaux', 'Traités Internationaux'),
        ('convention', 'Convention'),
        ('lois organiques', 'Lois Organiques'),
        ('lois ordinaires', 'Lois Ordinaires'),
        ('ordonnances', 'Ordonnances'),
        ('decrets', 'Décrets'),
        ('arretes interministeriels', 'Arrêtés Interministériels'),
        ('arretes', 'Arrêtés'),
        ('circilaire', 'Circulaire'),
        ('notes', 'Notes'),
    ]

    CONSEIL_CHOICES = [
        ('aucun', 'Aucun'),
        ('ministre', 'Ministre'),
        ('gouvernement', 'Gouvernement'),
    ]

    STATUS_CHOICES = [
        ('en_vigueur', 'En vigueur'),
        ('abroge', 'Abrogé'),
    ]

    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    objet = models.TextField()
    numero = models.TextField()
    date = models.DateField()
    conseil = models.CharField(max_length=50, choices=CONSEIL_CHOICES, default='aucun')
    domaine = models.ForeignKey('Domaine', on_delete=models.CASCADE, null=True,blank=True)
    fichier = models.FileField(upload_to='documents/')
    pdf_file = models.FileField(upload_to='pdf_documents/', null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='en_vigueur')

    def __str__(self):
        return f"{self.type} - {self.numero}"
    
    def convert_to_pdf(self):
        """
        Convertit un fichier .docx en PDF en utilisant Microsoft Word via pywin32,
        et enregistre le fichier converti dans le dossier 'pdf_documents/' situé au même niveau que 'documents/'.
        """
        if not self.fichier.name.endswith('.docx'):
            raise ValueError("La conversion en PDF est uniquement prise en charge pour les fichiers .docx.")

        # Chemin absolu du fichier .docx original
        input_path = self.fichier.path
        print(f"Chemin du fichier original : {input_path}")

        # Dossier 'media/' contenant 'documents/' et 'pdf_documents/'
        media_root = os.path.dirname(os.path.dirname(input_path))

        # Dossier de sortie pour les fichiers PDF
        output_dir = os.path.join(media_root, 'pdf_documents')
        os.makedirs(output_dir, exist_ok=True)  # Crée le dossier s'il n'existe pas
        print(f"Dossier de sortie des PDFs : {output_dir}")

        # Chemin complet du fichier PDF généré
        output_path = os.path.join(output_dir, os.path.basename(input_path).replace('.docx', '.pdf'))
        print(f"Chemin du fichier PDF généré : {output_path}")

        try:
            # Initialiser COM pour Microsoft Word
            pythoncom.CoInitialize()
            word = win32com.client.Dispatch("Word.Application")
            doc = word.Documents.Open(input_path)
            doc.SaveAs(output_path, FileFormat=17)  # 17 correspond au format PDF
            doc.Close()
            word.Quit()

            # Enregistrer le chemin relatif du fichier PDF dans le champ pdf_file
            relative_output_path = os.path.relpath(output_path, media_root)
            self.pdf_file.name = relative_output_path
            print(f"Chemin enregistré dans pdf_file : {self.pdf_file.name}")
            self.save()

        except Exception as e:
            raise ValueError(f"Erreur lors de la conversion du fichier : {e}")

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
    class Meta:
        indexes = [
            models.Index(fields=['objet']),
            models.Index(fields=['numero']),
        ]


class Actualite(models.Model):
    CONSEIL_CHOICES = [
        ('CONSEIL DE MINISTRE', 'Ministre'),
        ('CONSEIL DE GOUVERNEMENT', 'Gouvernement'),
    ]
    conseil = models.CharField(max_length=50,choices=CONSEIL_CHOICES,default='CONSEIL DE MINISTRE')
    titre = models.CharField(max_length=200)
    date = models.DateField(default='2024-01-01')
    lieu = models.CharField(max_length=100)
    texte = models.TextField()

    def __str__(self):
        return self.titre

class Remark(models.Model):
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email