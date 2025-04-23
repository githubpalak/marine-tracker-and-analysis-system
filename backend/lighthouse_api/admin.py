from django.contrib import admin
from .models import Lighthouse

@admin.register(Lighthouse)
class LighthouseAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'height', 'year_built')
    search_fields = ('name', 'country')