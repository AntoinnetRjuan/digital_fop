from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet, DomaineViewSet, SuggestionsView, ActualiteViewSet, RemarkViewSet,DocumentStatsView,DocumentStatsAPIView,DocumentVisitsView,MostVisitedDocumentsView,UpdateStatusView,DocumentTelechargementView

router = DefaultRouter()
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'domaines', DomaineViewSet, basename='domaine')
router.register(r'actualites', ActualiteViewSet, basename='actualites')
router.register(r'remarks', RemarkViewSet, basename='remark')

urlpatterns = [
    path('', include(router.urls)),
    path('suggestions/', SuggestionsView.as_view(), name='suggestions'),
    path('document-stats/', DocumentStatsView.as_view(), name='document-stats'),
    path('documents-stats/', DocumentStatsAPIView.as_view(), name='document-stats'),
    path('documents/<int:document_id>/visit/', DocumentVisitsView.as_view(), name='document-visit'),
    path('documents/<int:document_id>/telechargement/', DocumentTelechargementView.as_view(), name='document-telechargement'),
    path('most-visited/', MostVisitedDocumentsView.as_view(), name='most-visited-documents'),
    path('documents/<int:pk>/status/', UpdateStatusView.as_view(), name='update-status'),
]
