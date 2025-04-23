from rest_framework import serializers
from .models import Vessel, VesselPosition

class VesselPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VesselPosition
        fields = '__all__'
        read_only_fields = ('id', 'timestamp')

class VesselSerializer(serializers.ModelSerializer):
    last_position = VesselPositionSerializer(read_only=True)
    
    class Meta:
        model = Vessel
        fields = '__all__'
        read_only_fields = ('id',)

class VesselListSerializer(serializers.ModelSerializer):
    last_position = VesselPositionSerializer(read_only=True)
    
    class Meta:
        model = Vessel
        fields = ['id', 'mmsi', 'name', 'vessel_type', 'last_position']