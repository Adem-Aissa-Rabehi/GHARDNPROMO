"""
URL configuration for backend_core project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.http import HttpResponse, FileResponse
from pathlib import Path

def serve_react(request):
    """Sert index.html de React en cas de requête directe sur Django."""
    candidates = [
        settings.BASE_DIR.parent / 'dist' / 'index.html',
        settings.BASE_DIR.parent / 'index.html',
        settings.BASE_DIR / 'index.html',
    ]
    for p in candidates:
        if p.exists():
            return FileResponse(open(p, 'rb'), content_type='text/html')
    return HttpResponse("<h1>GHARDN PROM API Active</h1>", content_type='text/html')

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/', include('gallery.urls')),
    path('', include('gallery.urls')),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
]
