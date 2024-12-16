
from rest_framework import viewsets, filters
from .models import Document,Domaine
from .serializers import DocumentSerializer,DomaineSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .filters import DocumentFilter
from .paginations import CustomPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class DomaineViewSet(viewsets.ModelViewSet):
    queryset = Domaine.objects.all()
    serializer_class = DomaineSerializer

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = DocumentFilter
    search_fields = ['objet','numero']
    pagination_class = CustomPagination
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.action in ['destroy', 'update', 'partial_update']:
            return [IsAuthenticated()]  # Seuls les utilisateurs authentifiés peuvent modifier ou supprimer
        return [AllowAny()] 
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', '')
        if search:
            queryset = queryset.filter(
                Q(objet__icontains=search) |
                Q(numero__icontains=search)
            )
        return queryset
    
class SuggestionsView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, *args, **kwargs):
        search_by = request.query_params.get("searchBy", "objet")
        query = request.query_params.get("query", "").strip()

        if not query:
            return Response([])

        suggestions = Document.objects.filter(**{f"{search_by}__icontains": query}).values_list(search_by, flat=True).distinct()[:10]
        return Response(suggestions)