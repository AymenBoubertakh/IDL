from django.urls import path
from . import views

urlpatterns = [
    # Course endpoints
    path('courses/', views.course_list, name='course-list'),
    path('courses/search/', views.course_search, name='course-search'),
    path('courses/<int:pk>/', views.course_detail, name='course-detail'),
    
    # Enrollment endpoints
    path('courses/<int:pk>/enroll/', views.enroll_student, name='enroll-student'),
    path('courses/<int:pk>/unenroll/', views.unenroll_student, name='unenroll-student'),
    path('courses/<int:pk>/students/', views.course_students, name='course-students'),
    
    # StudentCourse endpoints
    path('enrollments/', views.enrollment_list, name='enrollment-list'),
    path('enrollments/<int:pk>/', views.enrollment_detail, name='enrollment-detail'),
    path('enrollments/by_student/', views.student_courses, name='student-courses'),
]