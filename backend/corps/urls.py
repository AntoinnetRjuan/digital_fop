from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CorpsViewSet,TypeCorpsViewSet,FilteredCorpsAPIView,corps_professionnels_list,CorpsStatsView,CorpsStatsAPIView,CorpsTelechargementView,CorpsVisitsView,MostVisitedCorpsView

router = DefaultRouter()
router.register(r'corps',CorpsViewSet,basename='corps')
router.register(r'typecorps',TypeCorpsViewSet,basename='type')

urlpatterns = [
    path('',include(router.urls)),
    path('corps-filter/', FilteredCorpsAPIView.as_view(), name='filtered-corps'),
    path('corps-professionnels/', corps_professionnels_list, name='corps-professionnels-list'),
    path('corps-stats/', CorpsStatsView.as_view(), name='corps-stats'),
    path('corps-stats1/', CorpsStatsAPIView.as_view(), name='corps-stats'),
    path('corps/<int:corps_id>/visit/', CorpsVisitsView.as_view(), name='corps-visit'),
    path('corps/<int:corps_id>/telechargement/', CorpsTelechargementView.as_view(), name='corps-telechargement'),
    path('most-visited-corps/', MostVisitedCorpsView.as_view(), name='most-visited-corps'),
]
