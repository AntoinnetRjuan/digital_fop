from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from .models import TypeCorps,Corps
from .serializers import CorpsSerializer, TypeCorpsSerializer

class TypeCorpsViewSet(viewsets.ModelViewSet):
    queryset = TypeCorps.objects.all()
    serializer_class = TypeCorpsSerializer

class CorpsViewSet(viewsets.ModelViewSet):
    queryset = Corps.objects.all()
    serializer_class = CorpsSerializer

