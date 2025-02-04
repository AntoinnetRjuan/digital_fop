from django.db import models
class AppRating(models.Model):
    stars = models.IntegerField()
    session_id = models.CharField(max_length=255)  # Pour éviter les doublons par utilisateur
    created_at = models.DateTimeField(auto_now_add=True)