from rest_framework import serializers
from .models import Vessel, VesselPosition

class VesselPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VesselPosition
        fields = ['id', 'latitude', 'longitude', 'heading', 'speed', 'status', 'timestamp']

class VesselSerializer(serializers.ModelSerializer):
    last_position = serializers.SerializerMethodField()
    
    class Meta:
        model = Vessel
        fields = ['id', 'mmsi', 'name', 'vessel_type', 'flag', 'length', 'width', 'image_url', 'last_position']
        
    def get_last_position(self, obj):
        last_pos = obj.positions.first()
        if last_pos:
            return VesselPositionSerializer(last_pos).data
        return None

class VesselDetailSerializer(serializers.ModelSerializer):
    positions = VesselPositionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Vessel
        fields = ['id', 'mmsi', 'name', 'vessel_type', 'flag', 'length', 'width', 'image_url', 'positions']