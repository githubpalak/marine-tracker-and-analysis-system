from rest_framework import serializers
from .models import Lighthouse

class LighthouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lighthouse
        fields = ['id', 'name', 'country', 'latitude', 'longitude', 'height', 'year_built', 'image_url']
