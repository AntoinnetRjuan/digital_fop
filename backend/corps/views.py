from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework import viewsets
from .models import TypeCorps,Corps,CorpsStats
from .serializers import CorpsSerializer, TypeCorpsSerializer
from django.http import JsonResponse
from django.db.models import Count
from rest_framework.decorators import action
from datetime import date
from django.db.models import Sum

class TypeCorpsViewSet(viewsets.ModelViewSet):
    queryset = TypeCorps.objects.all()
    serializer_class = TypeCorpsSerializer

class CorpsViewSet(viewsets.ModelViewSet):
    queryset = Corps.objects.all()
    serializer_class = CorpsSerializer
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Changer le statut d'un corps"""
        corps = self.get_object()
        new_status = request.data.get('status')
        if new_status in ['actif', 'inactif']:
            corps.status = new_status
            corps.save()
            return Response({'message': 'Statut mis à jour avec succès.'})
        return Response({'error': 'Statut invalide.'}, status=status.HTTP_400_BAD_REQUEST)
    def get_permissions(self):
        if self.action in ['destroy', 'update', 'partial_update']:
            return [IsAuthenticated()]
        return [AllowAny()]
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Corps supprimé avec succès."}, status=204)
    def create(self, request, *args, **kwargs):
        # Mettre à jour les statistiques
        today = date.today()
        stats, created = CorpsStats.objects.get_or_create(date=today)
        stats.daily_count += 1
        stats.monthly_count += 1
        stats.yearly_count += 1
        stats.save()

        return super().create(request, *args, **kwargs)
#ceci est le vue pour suivi du nombre des corps par nom
class CorpsStatsView(APIView):
    def get(self,request,*args,**kwargs):
        corps_nom = request.query_params.get('nom',None)

        if corps_nom:
            count = Corps.objects.filter(nom=corps_nom).count()
            return Response({'nom':corps_nom,'count':count})
        total_corps = Corps.objects.count()
        corps_by_nom = Corps.objects.values('nom').annotate(count=Count('nom')).order_by('nom')

        return Response({
            'total_corps':total_corps,
            'corps_by_nom':corps_by_nom,
        })
#ceci est le vue pour le suivi d'ajout du corps
class CorpsStatsAPIView(APIView):
    def get(self, request, *args, **kwargs):
        period = request.query_params.get('period', 'daily')
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)

        try:
            if period == 'daily':
                if start_date and end_date:
                    # Filtrer par plage de dates pour les statistiques journalières
                    total = CorpsStats.objects.filter(date__range=[start_date, end_date]).aggregate(total=Sum('daily_count'))['total'] or 0
                else:
                    # Afficher les statistiques pour aujourd'hui par défaut
                    today = date.today()
                    total = CorpsStats.objects.filter(date=today).aggregate(total=Sum('daily_count'))['total'] or 0
            elif period == 'monthly':
                # Statistiques mensuelles
                today = date.today()
                total = CorpsStats.objects.filter(date__month=today.month, date__year=today.year).aggregate(total=Sum('monthly_count'))['total'] or 0
            elif period == 'yearly':
                # Statistiques annuelles
                today = date.today()
                total = CorpsStats.objects.filter(date__year=today.year).aggregate(total=Sum('yearly_count'))['total'] or 0
            else:
                return Response({"error": "Période invalide. Utilisez 'daily', 'monthly' ou 'yearly'."}, status=400)

            return Response({
                'daily_count': total if period == 'daily' else 0,
                'monthly_count': total if period == 'monthly' else 0,
                'yearly_count': total if period == 'yearly' else 0,
            })
        except Exception as e:
            return Response({"error": f"Une erreur s'est produite : {str(e)}"}, status=500)

class FilteredCorpsAPIView(APIView):
   
    def get(self, request):
        corps_nom = request.query_params.get('corps', None)  # Récupère le paramètre 'corps' dans l'URL
        if corps_nom:
            corps_filtered = Corps.objects.filter(nom=corps_nom)
        else:
            corps_filtered = Corps.objects.all()  # Si aucun filtre, retourne tout

        serializer = CorpsSerializer(corps_filtered, many=True)
        return Response(serializer.data)
    
def corps_professionnels_list(request):
    corps_list = Corps.objects.values('id', 'nom')
    return JsonResponse(list(corps_list), safe=False)

