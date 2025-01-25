from .models import Visit

class VisitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Exclure certaines requêtes comme les URLs admin ou les APIs
        if not request.path.startswith('/admin') and not request.path.startswith('/api'):
            ip_address = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')

            # Vérifier si une session existe déjà pour cet utilisateur
            if 'visited' not in request.session:
                # Enregistrer la visite dans la base de données
                Visit.objects.create(ip_address=ip_address, user_agent=user_agent)
                # Marquer la session comme visitée
                request.session['visited'] = True

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