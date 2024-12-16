from django.db import models 
# Create your models here.
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager

class User(AbstractBaseUser,PermissionsMixin):
    nom = models.CharField(_("nom"),max_length=100)
    prenom = models.CharField(_("prenom"),max_length=100)
    email = models.EmailField(_("email"),max_length=254,unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nom","prenom"]

    objects = CustomUserManager()

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
    def __str__(self):
        return self.email
    @property
    def get_full_name(self):
        return f"{self.nom} {self.prenom}"
    






