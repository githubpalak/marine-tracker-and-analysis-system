from django.db import models

class Vessel(models.Model):
    mmsi = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    vessel_type = models.CharField(max_length=100, blank=True, null=True)
    flag = models.CharField(max_length=50, blank=True, null=True)
    length = models.FloatField(blank=True, null=True)
    width = models.FloatField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.name} ({self.mmsi})"

class VesselPosition(models.Model):
    vessel = models.ForeignKey(Vessel, on_delete=models.CASCADE, related_name='positions')
    latitude = models.FloatField()
    longitude = models.FloatField()
    heading = models.FloatField(blank=True, null=True)
    speed = models.FloatField(blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.vessel.name} @ ({self.latitude}, {self.longitude}) on {self.timestamp}"