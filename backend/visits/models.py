from django.db import models
from django.utils.timezone import now

class Visit(models.Model):
    ip_address = models.GenericIPAddressField()  # Adresse IP du visiteur
    user_agent = models.TextField()  # Informations sur le navigateur
    timestamp = models.DateTimeField(default=now)  # Date et heure de la visite

    def __str__(self):
        return f"Visite de {self.ip_address} à {self.timestamp}"