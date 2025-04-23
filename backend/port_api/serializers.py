from rest_framework import serializers
from .models import Port

class PortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Port
        fields = ['id', 'name', 'country', 'latitude', 'longitude', 'size', 'un_locode', 'image_url']
