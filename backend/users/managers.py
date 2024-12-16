from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    def email_validator(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError(_("Vous devez entrer un email valide"))
        
    def create_user(self, nom, prenom, email, password=None, **extra_fields):
        if not nom:
            raise ValueError(_("Les utilisateurs doivent soumettre un nom"))
        if not prenom:
            raise ValueError(_("Les utilisateurs doivent soumettre un prenom"))
        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_("email est requis"))

        user = self.model(
            nom=nom,
            prenom=prenom,
            email=email,
            **extra_fields
        )
        user.set_password(password)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        user.save(using=self._db)
        return user

    def create_superuser(self, nom, prenom, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser doit avoir is_superuser=True"))
        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser doit avoir is_staff=True"))
        if not password:
            raise ValueError(_("Superuser doit avoir un mot de passe"))

        user = self.create_user(nom, prenom, email, password, **extra_fields)
        return user
