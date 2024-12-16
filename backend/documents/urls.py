from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet,DomaineViewSet,SuggestionsView

router = DefaultRouter()
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'domaines', DomaineViewSet, basename='domaine')

urlpatterns = [
    path('', include(router.urls)),
    path('suggestions/', SuggestionsView.as_view(), name='suggestions'),
]
