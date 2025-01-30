from rest_framework import viewsets, filters,status
from .models import Document, Domaine, Actualite, Remark, DocumentStats
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
from django.utils.timezone import now
from django.db.models import Count
from rest_framework.decorators import action
from datetime import date
from django.db.models import Sum
import logging  
from unidecode import unidecode 

logger = logging.getLogger(__name__)
class DocumentStatsView(APIView):
    def get(self, request, *args, **kwargs):
        doc_type = request.query_params.get('type', None)

        if doc_type:
            # Filtrer par type
            count = Document.objects.filter(type=doc_type).count()
            return Response({'type': doc_type, 'count': count})

        # Renvoyer les statistiques globales si aucun type n'est sélectionné
        total_documents = Document.objects.count()
        documents_by_type = Document.objects.values('type').annotate(count=Count('type')).order_by('type')

        return Response({
            'total_documents': total_documents,
            'documents_by_type': documents_by_type,
        })


class DocumentStatsAPIView(APIView):
    def get(self, request, *args, **kwargs):
        period = request.query_params.get('period', 'daily')
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)

        try:
            if period == 'daily':
                if start_date and end_date:
                    # Filtrer par plage de dates pour les statistiques journalières
                    total = DocumentStats.objects.filter(date__range=[start_date, end_date]).aggregate(total=Sum('daily_count'))['total'] or 0
                else:
                    # Afficher les statistiques pour aujourd'hui par défaut
                    today = date.today()
                    total = DocumentStats.objects.filter(date=today).aggregate(total=Sum('daily_count'))['total'] or 0
            elif period == 'monthly':
                # Statistiques mensuelles
                today = date.today()
                total = DocumentStats.objects.filter(date__month=today.month, date__year=today.year).aggregate(total=Sum('monthly_count'))['total'] or 0
            elif period == 'yearly':
                # Statistiques annuelles
                today = date.today()
                total = DocumentStats.objects.filter(date__year=today.year).aggregate(total=Sum('yearly_count'))['total'] or 0
            else:
                return Response({"error": "Période invalide. Utilisez 'daily', 'monthly' ou 'yearly'."}, status=400)

            return Response({
                'daily_count': total if period == 'daily' else 0,
                'monthly_count': total if period == 'monthly' else 0,
                'yearly_count': total if period == 'yearly' else 0,
            })
        except Exception as e:
            return Response({"error": f"Une erreur s'est produite : {str(e)}"}, status=500)

class DomaineViewSet(viewsets.ModelViewSet):
    queryset = Domaine.objects.all().order_by('-id')
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
        domaine_id = self.request.query_params.get('domaine', '')
        search_by = self.request.query_params.get('searchBy', '')
        doc_type = self.request.query_params.get('type','')
        search_value = self.request.query_params.get('searchValue', '')
        date_journal = self.request.query_params.get('dateJournal', '')
        numero_journal = self.request.query_params.get('numeroJournal', '')

        if doc_type:
            queryset = queryset.filter(type__icontains=doc_type)

        if search_by and search_value:
            if search_by == 'objet':
                queryset = queryset.filter(objet__icontains=search_value)
            elif search_by == 'numero':
                queryset = queryset.filter(numero__icontains=search_value)
            elif search_by == 'date':
                queryset = queryset.filter(date=search_value)
        if domaine_id:
            queryset = queryset.filter(domaine__id=domaine_id)
        if date_journal:
            queryset = queryset.filter(date_journal=date_journal)
        if numero_journal:
            queryset = queryset.filter(numero_journal__icontains=numero_journal)

        return queryset
    def partial_update(self, request, *args, **kwargs):
        print("Fichiers reçus :", request.FILES)
        print("Données reçues :", request.data)
        if not request.FILES.get('fichier'):
            return Response({"error": "Aucun fichier détecté dans la requête."}, status=400)
        return super().partial_update(request, *args, **kwargs)
    def perform_update(self, serializer):
        instance = serializer.save()
        user = self.request.user  # Utilisateur courant
        modification_details = "Champs modifiés : " + ", ".join(serializer.validated_data.keys())
        instance.update_modification(user=user, details=modification_details)
        if instance.fichier and instance.fichier.name.endswith('.docx'):
            instance.convert_to_pdf()
    def create(self, request, *args, **kwargs):
        # Gérer les champs Journal Officiel
        inclus_journal = request.data.get("inclusJournal", False)
        if str(inclus_journal).lower() == "true":
            request.data["inclus_journal"] = True
            request.data["date_journal"] = request.data.get("dateJournal")
            request.data["numero_journal"] = request.data.get("numeroJournal")
            request.data["page_journal"] = request.data.get("pageJournal")
        else:
            request.data["inclus_journal"] = False
            request.data["date_journal"] = None
            request.data["numero_journal"] = None
            request.data["page_journal"] = None

        today = date.today()
        stats, created = DocumentStats.objects.get_or_create(date=today)
        stats.daily_count += 1
        stats.monthly_count += 1
        stats.yearly_count += 1
        stats.save()


        return super().create(request, *args, **kwargs)
    
class DocumentVisitsView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, document_id, *args, **kwargs):
        try:
            document = Document.objects.get(id=document_id)
            document.increment_visits()  # Incrémente le compteur de visites
            return Response({"message": "Visite enregistrée"}, status=status.HTTP_200_OK)
        except Document.DoesNotExist:
            return Response({"error": "Document non trouvé"}, status=status.HTTP_404_NOT_FOUND)

class DocumentTelechargementView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, document_id, *args, **kwargs):
        try:
            document = Document.objects.get(id=document_id)
            document.increment_telechargements()  # Incrémente le compteur de telechargements
            return Response({"message": "Visite enregistrée"}, status=status.HTTP_200_OK)
        except Document.DoesNotExist:
            return Response({"error": "Document non trouvé"}, status=status.HTTP_404_NOT_FOUND)
class MostVisitedDocumentsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        # Récupérer les 10 documents les plus visités
        most_visited_documents = Document.objects.order_by('-visits')[:10]
        serializer = DocumentSerializer(most_visited_documents, many=True)
        return Response(serializer.data)

class SuggestionsView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, *args, **kwargs):
        search_by = request.query_params.get("searchBy", "objet")
        query = request.query_params.get("query", "").strip()
        doc_type = request.query_params.get("type", "").strip()

        if not query:
            return Response([])

        # Normaliser la requête (enlever les accents et mettre en minuscule)
        normalized_query = unidecode(query).lower()

        if search_by == 'type':
            suggestions = Document.objects.filter(
                type__icontains=normalized_query
            ).values_list('type', flat=True).distinct()[:10]
        else:
            filter_kwargs = {f"{search_by}__icontains": normalized_query}
            if doc_type:
                filter_kwargs["type__icontains"] = doc_type
            suggestions = Document.objects.filter(**filter_kwargs).values_list(search_by, flat=True).distinct()[:10]

        return Response(suggestions)

class ActualiteViewSet(viewsets.ModelViewSet):
    queryset = Actualite.objects.all()
    serializer_class = ActualiteSerialiser

    def get_queryset(self):
        id_param = self.kwargs.get('pk', None)

        if id_param:
            return Actualite.objects.filter(id=id_param)

        conseil_ministre = Actualite.objects.filter(conseil='CONSEIL DES MINISTRES').order_by('-id')[:4]
        conseil_gouvernement = Actualite.objects.filter(conseil='CONSEIL DU GOUVERNEMENT').order_by('-id')[:4]

        queryset = list(conseil_ministre) + list(conseil_gouvernement)

        return queryset

class RemarkViewSet(viewsets.ModelViewSet):
    queryset = Remark.objects.all()
    serializer_class = RemarkSerializer
    permission_classes = [AllowAny]  # Permettre aux utilisateurs non authentifiés de créer des remarques


class UpdateStatusView(APIView):
    def patch(self, request, pk):
        try:
            # Récupérer le document par son ID
            document = Document.objects.get(pk=pk)
        except Document.DoesNotExist:
            return Response({"error": "Document not found."}, status=status.HTTP_404_NOT_FOUND)

        # Vérifier si le champ 'status' est présent dans la requête
        new_status = request.data.get("status")
        if not new_status:
            return Response({"error": "Status field is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Mettre à jour uniquement le statut
        document.status = new_status
        document.save()

        return Response({"message": "Status updated successfully.", "status": document.status}, status=status.HTTP_200_OK)

