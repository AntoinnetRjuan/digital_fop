from django.db import models
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

    def __str__(self):
        return self.nom

