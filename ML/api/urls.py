from django.urls import path
from . import views

urlpatterns = [
    path('process-resume/', views.process_resume, name='process_resume'),
    path('scrape-company/', views.scrape_company, name='scrape_company'), 
    path('history/', views.get_history, name='get_history'),
    path('health/', views.health_check, name='health_check'),
]