from django.contrib import admin
from .models import Course, StudentCourse


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'instructor', 'category', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'instructor', 'category']
    ordering = ['-created_at']


@admin.register(StudentCourse)
class StudentCourseAdmin(admin.ModelAdmin):
    list_display = ['id', 'student_id', 'course', 'enrolled_at']
    list_filter = ['enrolled_at']
    search_fields = ['student_id', 'course__name']
    ordering = ['-enrolled_at']