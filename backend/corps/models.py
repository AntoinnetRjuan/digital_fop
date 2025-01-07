from django.db import models
import PyPDF2
import docx
import win32com.client
import pythoncom 
import os
class TypeCorps(models.Model):
    nom = models.CharField(max_length=100,unique=True,null=True)

    def __str__(self):
        return self.nom
class Corps(models.Model):
    STATUS_CHOICES = [
        ('actif', 'Actif'),
        ('inactif', 'Inactif'),
    ]

    nom = models.CharField(max_length=255)
    numero = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    type = models.ForeignKey(TypeCorps,on_delete=models.SET_NULL, null=True,blank=True)
    date_creation = models.DateField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES,null=True)
    fichier = models.FileField(upload_to='documents/',null=True)
    pdf_file = models.FileField(upload_to='pdf_documents/', null=True, blank=True)

    def __str__(self):
        return self.nom
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

