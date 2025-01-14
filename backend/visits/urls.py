from django.urls import path
from .views import visit_statistics

urlpatterns = [
    path('api/visit-statistics/', visit_statistics, name='visit-statistics'),
]
