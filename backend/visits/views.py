from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Count
from .models import Visit

def visit_statistics(request):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    visits = Visit.objects.all()
    if start_date and end_date:
        visits = visits.filter(timestamp__range=[start_date, end_date])

    # Visites totales par jour
    total_visits = visits.extra({'day': "date(timestamp)"}).values('day').annotate(count=Count('id')).order_by('day')

    # Visiteurs uniques par jour
    unique_visitors = visits.extra({'day': "date(timestamp)"}).values('day').annotate(count=Count('ip_address', distinct=True)).order_by('day')

    # Structure des données
    data = {
        'total_visits': list(total_visits),
        'unique_visitors': list(unique_visitors),
    }

    return JsonResponse(data, safe=False)

