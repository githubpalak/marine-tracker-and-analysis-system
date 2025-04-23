from rest_framework import serializers
from .models import Fleet
from vessel_api.serializers1 import VesselSerializer

class FleetSerializer(serializers.ModelSerializer):
    vessels_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Fleet
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'vessels_count']
    
    def get_vessels_count(self, obj):
        return obj.vessels.count()

class FleetDetailSerializer(serializers.ModelSerializer):
    vessels = VesselSerializer(many=True, read_only=True)
    
    class Meta:
        model = Fleet
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'vessels']
