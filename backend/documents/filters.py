import django_filters
from django.db.models import Q
from .models import Document
from unidecode import unidecode  # Pour gérer les accents

class DocumentFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method="filter_search", label="Recherche")
    domaine = django_filters.CharFilter(field_name="domaine__id", lookup_expr="exact")
    start_date = django_filters.DateFilter(field_name="date", lookup_expr="gte")
    end_date = django_filters.DateFilter(field_name="date", lookup_expr="lte")
    date_journal = django_filters.DateFilter(field_name="date_journal", lookup_expr="exact")
    numero_journal = django_filters.CharFilter(field_name="numero_journal", lookup_expr="icontains")
    type = django_filters.CharFilter(field_name="type", lookup_expr="icontains")

    class Meta:
        model = Document
        fields = ['type', 'start_date', 'end_date', 'numero', 'objet', 'date_journal', 'numero_journal']

    def filter_search(self, queryset, name, value):
        search_by = self.request.GET.get('searchBy', '')
        search_value = self.request.GET.get('searchValue', '')
        doc_type = self.request.GET.get('type', '')

        # Normaliser la valeur de recherche (enlever les accents et mettre en minuscule)
        normalized_value = unidecode(search_value).lower()

        if doc_type:
            queryset = queryset.filter(type__icontains=doc_type)

        if search_by == 'journal':
            date_journal = self.request.GET.get('dateJournal', '')
            numero_journal = self.request.GET.get('numeroJournal', '')
            if date_journal:
                queryset = queryset.filter(date_journal=date_journal)
            if numero_journal:
                queryset = queryset.filter(numero_journal__icontains=numero_journal)
        elif search_by == 'objet' and search_value:
            queryset = queryset.filter(objet__icontains=normalized_value)
        elif search_by == 'numero' and search_value:
            queryset = queryset.filter(numero__icontains=normalized_value)
        elif search_by == 'date' and search_value:
            queryset = queryset.filter(date=search_value)

        return queryset