# from rest_framework import serializers
# from .models import Lighthouse

# class LighthouseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Lighthouse
#         fields = ['id', 'name', 'country', 'latitude', 'longitude', 'height', 'year_built', 'image_url']

# from rest_framework import serializers
# from .models import Lighthouse

# class LighthouseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Lighthouse
#         fields = ['id', 'name', 'country', 'latitude', 'longitude', 'website',
#                   # 'height', 'year_built', 'image_url'
#                   ]

# class LighthouseCsvSerializer(serializers.Serializer):
#     """
#     Serializer for lighthouse data from CSV file.
#     """
#     id = serializers.IntegerField()
#     name = serializers.CharField()
#     latitude = serializers.FloatField()
#     longitude = serializers.FloatField()
#     website = serializers.CharField(allow_blank=True, allow_null=True)

from rest_framework import serializers
from .models import Lighthouse

class LighthouseSerializer(serializers.ModelSerializer):
    """
    Serializer for lighthouse data from database model.
    """
    class Meta:
        model = Lighthouse
        fields = ['id', 'name', 'country', 'latitude', 'longitude', 'website',
                  'height', 'year_built', 'image_url']

class LighthouseCsvSerializer(serializers.Serializer):
    """
    Serializer for lighthouse data from CSV file.
    """
    id = serializers.IntegerField()
    name = serializers.CharField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    website = serializers.CharField(allow_blank=True, allow_null=True)