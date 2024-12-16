from django.contrib import admin
from .models import Document,Domaine

@admin.register(Domaine)
class DomaineAdmin(admin.ModelAdmin):
    list_display = ('nom',)
    search_fields = ('nom',)

# Register your models here.
admin.site.site_header = "Administration de Bibliotheque Numerique"
admin.site.site_title = "Bibliotheque numerique admin"
@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('type', 'numero', 'date', 'conseil', 'domaine', 'status')
    search_fields = ('type', 'numero', 'objet', 'domaine__nom')
    list_filter = ('type', 'conseil', 'domaine', 'status')
    ordering = ('-date',)
    fieldsets = (
        ("Informations principales", {
            'fields': ('type', 'objet', 'numero', 'date')
        }),
        ("Détails supplémentaires", {
            'fields': ('conseil', 'domaine', 'status')
        }),
        ("Fichier", {
            'fields': ('fichier',),
        }),
    )
