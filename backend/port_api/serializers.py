# from rest_framework import serializers
# from .models import Port

# class PortSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Port
#         fields = ['id', 'name', 'country', 'latitude', 'longitude', 'size', 'un_locode', 'image_url']

# port_api/serializers.py
from rest_framework import serializers

class PortSerializer(serializers.Serializer):
    Country = serializers.CharField()
    Port_Name = serializers.CharField()
    UN_Code = serializers.CharField()
    Vessels_in_Port = serializers.IntegerField()
    Departures_Last_24_Hours = serializers.IntegerField()
    Arrivals_Last_24_Hours = serializers.IntegerField()
    Expected_Arrivals = serializers.IntegerField()
    Type = serializers.CharField()
    Area_Local = serializers.CharField()
    Area_Global = serializers.CharField()
    Also_known_as = serializers.CharField(allow_blank=True)
