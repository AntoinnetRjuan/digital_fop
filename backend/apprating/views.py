from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import models
from .models import AppRating
import json

@csrf_exempt
def submit_rating(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            stars = data.get("stars")
            session_id = data.get("session_id")  # Récupérer l'ID de session

            if stars is None or not (1 <= stars <= 5):
                return JsonResponse({"error": "Invalid rating"}, status=400)

            # Enregistrer la note
            rating = AppRating(stars=stars, session_id=session_id)
            rating.save()

            return JsonResponse({"message": "Rating saved successfully"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    elif request.method == "GET":
        ratings = list(AppRating.objects.values("session_id", "stars"))
        return JsonResponse(ratings, safe=False)

    return JsonResponse({"error": "Method not allowed"}, status=405)


def get_average_rating(request):
    total_ratings = AppRating.objects.count()
    if total_ratings == 0:
        return JsonResponse({"average_rating": 0})

    average_rating = AppRating.objects.aggregate(models.Avg("stars"))["stars__avg"]
    return JsonResponse({"average_rating": round(average_rating, 1)})

def get_total_stars(request):
    total_ratings = AppRating.objects.count()
    if total_ratings == 0:
        return JsonResponse({"total_stars": 0})

    total_stars = AppRating.objects.aggregate(models.Sum("stars"))["stars__sum"]
    return JsonResponse({"total_stars": total_stars})

