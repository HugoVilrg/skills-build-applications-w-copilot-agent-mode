"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

import os
from django.http import JsonResponse
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'teams', views.TeamViewSet, basename='team')
router.register(r'activities', views.ActivityViewSet, basename='activity')
router.register(r'workouts', views.WorkoutViewSet, basename='workout')

# Custom API root to return API base URL using CODESPACE_NAME
def custom_api_root(request, format=None):
    codespace_name = os.environ.get('CODESPACE_NAME')
    if codespace_name:
        api_url = f"https://{codespace_name}-8000.app.github.dev/api/"
    else:
        api_url = request.build_absolute_uri('/api/')
    return JsonResponse({"api_base_url": api_url})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', custom_api_root, name='api-root'),
    path('api/', include(router.urls)),
    path('', custom_api_root),
]
