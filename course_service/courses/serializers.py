from rest_framework import serializers
from .models import Course, StudentCourse


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'instructor', 'category', 'schedule', 'created_at', 'updated_at']


class StudentCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentCourse
        fields = ['id', 'student_id', 'course', 'enrolled_at']