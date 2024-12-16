from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Document

@receiver(post_save, sender=Document)
def convert_docx_to_pdf(sender, instance, created, **kwargs):
    """
    Convertit automatiquement un fichier .docx en PDF après son enregistrement.
    """
    if created and instance.fichier.name.endswith('.docx'):
        try:
            pdf_path = instance.convert_to_pdf()
            print(f"PDF généré et enregistré : {pdf_path}")
        except Exception as e:
            print(f"Erreur lors de la conversion : {e}")
