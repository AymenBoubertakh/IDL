from django.urls import path
from . import views

urlpatterns = [
    # Student URLs
    path('add/', views.add_student, name='add_student'),
    path('getAll/', views.get_all_students, name='get_all_students'),
    
    path('getAllUniv/', views.get_all_students_university, name='get_all_students_university'),
    path('findStudUniv/', views.find_students_by_university, name='find_students_by_university'),
    
    # University URLs
    path('university/add/', views.add_university, name='add_university'),
    path('university/getAll/', views.get_all_universities, name='get_all_universities'),
]