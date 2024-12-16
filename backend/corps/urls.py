from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CorpsViewSet,TypeCorpsViewSet

router = DefaultRouter()
router.register(r'corps',CorpsViewSet,basename='corps')
router.register(r'typecorps',TypeCorpsViewSet,basename='type')

urlpatterns = [
    path('',include(router.urls)),
]
