from django.contrib import admin

# Register your models here.
# Register your models here.
from .models import vitenamData
# from .models import Camera
# from .models import ReceivedData
# from .models import VitenamData
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    # ... other patterns ...
]

class AnalysisDataAdmin(admin.ModelAdmin):
    list_display = ('date', 'other_field', ...)  # Replace 'date' and 'other_field' with actual field names


admin.site.register(vitenamData)
# admin.site.register(Camera)
# admin.site.register(ReceivedData)
# admin.site.register(VitenamData)