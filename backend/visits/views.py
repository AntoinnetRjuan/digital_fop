from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Count
from .models import Visit
from django.utils import timezone

def visit_statistics(request):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    visits = Visit.objects.all()
    if start_date and end_date:
        visits = visits.filter(timestamp__range=[start_date, end_date])

    # Nombre total de visites (sessions)
    total_visits = visits.count()

    # Nombre de visiteurs uniques (adresses IP distinctes)
    unique_visitors = visits.values('ip_address','visit_date').distinct().count()

    total_visits_per_day = visits.values('visit_date').annotate(count=Count('id')).order_by('visit_date')

    # Visiteurs uniques par jour (nouvelle logique)
    unique_visitors_per_day = visits.values('visit_date').annotate(count=Count('ip_address', distinct=True)).order_by('visit_date')

    today = timezone.now().date()  # Récupère la date d'aujourd'hui
    visits_today = Visit.objects.filter(visit_date=today).count()

    # Structure des données
    data = {
        'total_visits': total_visits,
        'unique_visitors': unique_visitors,
        'total_visits_per_day': list(total_visits_per_day),
        'unique_visitors_per_day': list(unique_visitors_per_day),
        'visits_today':visits_today,
    }

    return JsonResponse(data, safe=False)
