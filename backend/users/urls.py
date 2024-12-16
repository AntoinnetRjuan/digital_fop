from django.urls import path
from .views import CustomLoginView

urlpatterns = [
    path('jwt/create/', CustomLoginView.as_view(), name='custom-login'),
]

