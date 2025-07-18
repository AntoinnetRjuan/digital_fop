from django.urls import path
from .views import submit_rating, get_average_rating,get_total_stars

urlpatterns = [
    path("api/app-ratings/", submit_rating, name="submit_rating"),
    path("api/app-ratings/average_rating/", get_average_rating, name="get_average_rating"),
    path("api/app-ratings/total_stars/", get_total_stars, name="get_total_stars"),
]
