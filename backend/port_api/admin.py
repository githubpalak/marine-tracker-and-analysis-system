# from django.contrib import admin
# from .models import Port

# @admin.register(Port)
# class PortAdmin(admin.ModelAdmin):
#     list_display = ('name', 'country', 'size', 'un_locode')
#     search_fields = ('name', 'country')

from django.contrib import admin
from .models import DummyPort

@admin.register(DummyPort)
class DummyPortAdmin(admin.ModelAdmin):
    list_display = ['id']  # No fields to display, just dummy
