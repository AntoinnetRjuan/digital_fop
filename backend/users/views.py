from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model,login
from django.contrib.auth.models import update_last_login


User = get_user_model()  # Utilise le modèle utilisateur défini dans AUTH_USER_MODEL

class CustomLoginView(TokenObtainPairView):
    """
    Vue personnalisée pour gérer la connexion et ajouter une redirection
    en fonction des rôles (superadmin ou utilisateur normal).
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            # Récupérer l'utilisateur authentifié par email
            user = User.objects.filter(email=request.data.get('email')).first()

            if user:
                if user.is_superuser:
                    login(request, user)  # Authentifie l'utilisateur dans la session
                    update_last_login(None, user)  # Met à jour le dernier login
                    response.data['redirect_url'] = '/admin'
                else:
                    response.data['redirect_url'] = '/dashboard'
            else:
                return Response(
                    {"error": "Utilisateur non trouvé"},
                    status=status.HTTP_404_NOT_FOUND
                )

        return response