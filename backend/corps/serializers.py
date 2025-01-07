from rest_framework import serializers
from .models import Corps,TypeCorps
from django.core.files.storage import default_storage
from django.conf import settings
class TypeCorpsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeCorps
        fields = '__all__'

class CorpsSerializer(serializers.ModelSerializer):
    type = serializers.PrimaryKeyRelatedField(queryset=TypeCorps.objects.all())
    content = serializers.SerializerMethodField()
    pdf_url = serializers.SerializerMethodField()
    class Meta:
        model = Corps
        fields = '__all__'
    def get_content(self, obj):
        return obj.extract_content()
    def get_pdf_url(self, obj):
        if obj.fichier.name.endswith('.docx'):
            pdf_path = obj.fichier.name.replace('.docx', '.pdf')
            if default_storage.exists(pdf_path):
                return f"{settings.MEDIA_URL}{pdf_path}"
        return None