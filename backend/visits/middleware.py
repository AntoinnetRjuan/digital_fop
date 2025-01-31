from django.utils import timezone
from .models import Visit

class VisitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Exclure certaines requêtes comme les URLs admin ou les APIs
        if not request.path.startswith('/admin') and not request.path.startswith('/api'):
            ip_address = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            today = timezone.now().date()  # Récupère la date d'aujourd'hui

            # Vérifier si une session existe déjà pour cet utilisateur
            if 'visit_counted' not in request.session:
                # Enregistrer la visite dans la base de données (visite totale)
                Visit.objects.create(ip_address=ip_address, user_agent=user_agent, visit_date=today)
                # Marquer la session comme visitée
                request.session['visit_counted'] = True

            # Vérifier si l'utilisateur a déjà visité aujourd'hui (visiteur unique)
            if 'visited_today' not in request.session:
                if not Visit.objects.filter(ip_address=ip_address, visit_date=today).exists():
                    request.session['visited_today'] = True

        # Passer la requête au prochain middleware ou à la vue
        response = self.get_response(request)
        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip