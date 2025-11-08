from django.urls import path
from . import views

urlpatterns = [
    # AI endpoints
    path('translate/', views.translate_text, name='translate'),
    path('summarize/', views.summarize_text, name='summarize'),
    
    # Utility endpoints
    path('languages/', views.supported_languages, name='languages'),
    path('health/', views.health_check, name='health'),
]