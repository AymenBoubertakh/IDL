from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student, University
from .serializers import StudentSerializer, UniversitySerializer
from django.db import connection

@api_view(['POST'])
def add_student(request):
    serializer = StudentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "New student is added"})
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_all_students(request):
    students = Student.objects.all()
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_university(request):
    serializer = UniversitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "New university is added"})
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_all_universities(request):
    universities = University.objects.all()
    serializer = UniversitySerializer(universities, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_students_university(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT s.name, u.name FROM students_student s JOIN students_university u ON s.university_id = u.id")
        results = cursor.fetchall()
    
    formatted_results = []
    for row in results:
        formatted_results.append({
            "student_name": row[0],
            "university_name": row[1]
        })
    
    return Response(formatted_results)

@api_view(['GET'])
def find_students_by_university(request):
    univ_name = request.GET.get('univName', '')
    
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT s.name, u.name FROM students_student s JOIN students_university u ON s.university_id = u.id WHERE u.name = %s",
            [univ_name]
        )
        results = cursor.fetchall()
    
    formatted_results = []
    for row in results:
        formatted_results.append({
            "student_name": row[0],
            "university_name": row[1]
        })
    
    return Response(formatted_results)
