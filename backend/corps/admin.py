from django.contrib import admin
from .models import Corps,TypeCorps

@admin.register(TypeCorps)
class TypeCorpsAdmin(admin.ModelAdmin):
    list_display = ('nom',)
    search_fields = ('nom',)
# Register your models here.

@admin.register(Corps)
class CorpsAdmin(admin.ModelAdmin):
    list_display = ('nom','numero','description','type','date_creation','status')
    search_fields = ('nom','numero','type__nom','date_creation')
    list_filter = ('nom','numero','type','status')
    ordering = ('-date_creation',)
    fieldsets = (
        ("Informations principales", {
            'fields': ('nom', 'description', 'numero', 'date_creation')
        }),
        ("Détails supplémentaires", {
            'fields': ('type', 'status')
        }),
        ("Fichier", {
            'fields': ('fichier',),
        }),
    )
    
