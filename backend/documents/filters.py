import django_filters
from django.db.models import Q
from .models import Document

class DocumentFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method="filter_search", label="Recherche")
    
    start_date = django_filters.DateFilter(field_name="date", lookup_expr="gte")
    end_date = django_filters.DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = Document
        fields = ['type', 'domaine', 'start_date', 'end_date', 'numero','objet']
    def filter_search(self, queryset, name, value):
        # Rechercher dans plusieurs champs en même temps
        return queryset.filter(
            Q(objet__icontains=value) |
            Q(numero__icontains=value)
        )