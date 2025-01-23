from .models import Document,Domaine,Actualite,Remark
from rest_framework import serializers
from django.core.files.storage import default_storage
from django.conf import settings

class DomaineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domaine
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    domaine = serializers.PrimaryKeyRelatedField(queryset=Domaine.objects.all())
    content = serializers.SerializerMethodField()
    pdf_url = serializers.SerializerMethodField()
    last_modified_by = serializers.StringRelatedField(read_only=True)  # Nom de l'utilisateur
    last_modified_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    class Meta:
        model = Document
        fields = '__all__'

    def get_content(self, obj):
        return obj.extract_content()
    def get_pdf_url(self, obj):
        if obj.fichier.name.endswith('.docx'):
            pdf_path = obj.fichier.name.replace('.docx', '.pdf')
            if default_storage.exists(pdf_path):
                return f"{settings.MEDIA_URL}{pdf_path}"
        return None

class ActualiteSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Actualite
        fields = '__all__'

class RemarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Remark
        fields = ['id', 'email', 'message', 'created_at']
