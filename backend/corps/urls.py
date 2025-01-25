from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CorpsViewSet,TypeCorpsViewSet,FilteredCorpsAPIView,corps_professionnels_list,CorpsStatsView

router = DefaultRouter()
router.register(r'corps',CorpsViewSet,basename='corps')
router.register(r'typecorps',TypeCorpsViewSet,basename='type')

urlpatterns = [
    path('',include(router.urls)),
    path('corps-filter/', FilteredCorpsAPIView.as_view(), name='filtered-corps'),
    path('corps-professionnels/', corps_professionnels_list, name='corps-professionnels-list'),
    path('corps-stats/', CorpsStatsView.as_view(), name='corps-stats'),
]
