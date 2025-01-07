from django.http import HttpResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json

@csrf_exempt
def my_view(request):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "http://localhost:5173"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
        return response
    # Votre logique normale ici

@method_decorator(csrf_exempt, name='dispatch')
class MyAPIView(View):
    def options(self, request, *args, **kwargs):
        response = HttpResponse()
        #response["Access-Control-Allow-Origin"] = "http://localhost:5173"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
        return response
#     # Votre logique normale ici

def index(request):
    return render(request, 'index.html')

@require_POST
@csrf_exempt
def send_response(request):
    data = json.loads(request.body)
    email = data.get('email')
    response_message = data.get('response')

    if email and response_message:
        send_mail(
            'la reponse de votre remarque',
            response_message,
            'your-email@example.com',  # Replace with your email
            [email],
            fail_silently=False,
        )
        return JsonResponse({'message': 'Response sent successfully'})
    return JsonResponse({'error': 'Invalid data'}, status=400)
