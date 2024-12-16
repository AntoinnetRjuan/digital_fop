from rest_framework import serializers
from .models import Corps,TypeCorps
class TypeCorpsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeCorps
        fields = '__all__'

class CorpsSerializer(serializers.ModelSerializer):
    type = serializers.PrimaryKeyRelatedField(queryset=TypeCorps.objects.all())
    class Meta:
        model = Corps
        fields = '__all__'