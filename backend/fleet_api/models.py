from django.db import models
from vessel_api.models import Vessel

class Fleet(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    vessels = models.ManyToManyField(Vessel, related_name='fleets')
    
    def __str__(self):
        return self.name