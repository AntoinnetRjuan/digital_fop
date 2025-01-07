from rest_framework import viewsets, filters
from .models import Document, Domaine, Actualite, Remark
from .serializers import DocumentSerializer, DomaineSerializer, ActualiteSerialiser, RemarkSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .filters import DocumentFilter
from .paginations import CustomPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Q

class DomaineViewSet(viewsets.ModelViewSet):
    queryset = Domaine.objects.all()
    serializer_class = DomaineSerializer

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = DocumentFilter
    search_fields = ['objet', 'numero']
    pagination_class = CustomPagination
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.action in ['destroy', 'update', 'partial_update']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', '')
        doc_type = self.request.query_params.get('type', '')
        if search:
            queryset = queryset.filter(
                Q(objet__icontains=search) |
                Q(numero__icontains=search)
            )
        if doc_type:
            queryset = queryset.filter(type__icontains=doc_type)
        return queryset

class SuggestionsView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, *args, **kwargs):
        search_by = request.query_params.get("searchBy", "objet")
        query = request.query_params.get("query", "").strip()
        doc_type = request.query_params.get("type", "").strip()

        if not query:
            return Response([])
        if search_by == 'type':
            suggestions = Document.objects.filter(type__icontains=query).values_list('type', flat=True).distinct()[:10]
        else:
            filter_kwargs = {f"{search_by}__icontains": query}
            if doc_type:
                filter_kwargs["type__icontains"] = doc_type
            suggestions = Document.objects.filter(**filter_kwargs).values_list(search_by, flat=True).distinct()[:10]
        return Response(suggestions)

class ActualiteViewSet(viewsets.ModelViewSet):
    # queryset = Actualite.objects.all()
    serializer_class = ActualiteSerialiser

    def get_queryset(self):
        id_param = self.kwargs.get('pk', None)

        if id_param:
            return Actualite.objects.filter(id=id_param)

        conseil_ministre = Actualite.objects.filter(conseil='CONSEIL DE MINISTRE').order_by('-id')[:4]
        conseil_gouvernement = Actualite.objects.filter(conseil='CONSEIL DE GOUVERNEMENT').order_by('-id')[:4]

        queryset = list(conseil_ministre) + list(conseil_gouvernement)

        return queryset

class RemarkViewSet(viewsets.ModelViewSet):
    queryset = Remark.objects.all()
    serializer_class = RemarkSerializer
    permission_classes = [AllowAny]  # Permettre aux utilisateurs non authentifiés de créer des remarques

