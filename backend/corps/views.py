from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework import viewsets
from .models import TypeCorps,Corps
from .serializers import CorpsSerializer, TypeCorpsSerializer
from django.http import JsonResponse
from django.db.models import Count
from rest_framework.decorators import action

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

