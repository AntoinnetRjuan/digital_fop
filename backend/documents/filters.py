import django_filters
from django.db.models import Q
from .models import Document

class DocumentFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method="filter_search", label="Recherche")
    start_date = django_filters.DateFilter(field_name="date", lookup_expr="gte")
    end_date = django_filters.DateFilter(field_name="date", lookup_expr="lte")
    type = django_filters.CharFilter(field_name="type", lookup_expr="icontains")

    class Meta:
        model = Document
        fields = ['type', 'start_date', 'end_date', 'numero', 'objet']

    def filter_search(self, queryset, name, value):
        search_by = self.request.GET.get('searchBy', 'objet')
        doc_type = self.request.GET.get('type', '')
        if search_by == 'objet':
            queryset = queryset.filter(objet__icontains=value)
        elif search_by == 'numero':
            queryset = queryset.filter(numero__icontains=value)
        if doc_type:
            queryset = queryset.filter(type__icontains=doc_type)
        return queryset
