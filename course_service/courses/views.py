from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import Course, StudentCourse
from .serializers import CourseSerializer, StudentCourseSerializer


# ============ COURSE VIEWS ============

@api_view(['GET', 'POST'])
def course_list(request):
    """
    List all courses or create a new course
    GET /api/courses/
    POST /api/courses/
    """
    if request.method == 'GET':
        # Get query parameters for filtering
        name = request.GET.get('name', None)
        instructor = request.GET.get('instructor', None)
        category = request.GET.get('category', None)
        search = request.GET.get('search', None)
        
        # Start with all courses
        courses = Course.objects.all()
        
        # Apply filters
        if name:
            courses = courses.filter(name__icontains=name)
        if instructor:
            courses = courses.filter(instructor__icontains=instructor)
        if category:
            courses = courses.filter(category__icontains=category)
        if search:
            courses = courses.filter(
                Q(name__icontains=search) |
                Q(instructor__icontains=search) |
                Q(category__icontains=search)
            )
        
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def course_detail(request, pk):
    """
    Retrieve, update or delete a course
    GET /api/courses/{id}/
    PUT /api/courses/{id}/
    DELETE /api/courses/{id}/
    """
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CourseSerializer(course)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        course.delete()
        return Response({'message': 'Course deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def course_search(request):
    """
    Search courses by name, instructor, or category
    GET /api/courses/search/?name=...&instructor=...&category=...
    """
    name = request.GET.get('name', None)
    instructor = request.GET.get('instructor', None)
    category = request.GET.get('category', None)
    search = request.GET.get('search', None)
    
    courses = Course.objects.all()
    
    if name:
        courses = courses.filter(name__icontains=name)
    if instructor:
        courses = courses.filter(instructor__icontains=instructor)
    if category:
        courses = courses.filter(category__icontains=category)
    if search:
        courses = courses.filter(
            Q(name__icontains=search) |
            Q(instructor__icontains=search) |
            Q(category__icontains=search)
        )
    
    serializer = CourseSerializer(courses, many=True)
    return Response({
        'count': courses.count(),
        'results': serializer.data
    })


# ============ ENROLLMENT VIEWS ============

@api_view(['POST'])
def enroll_student(request, pk):
    """
    Enroll a student in a course
    POST /api/courses/{id}/enroll/
    Body: {"student_id": 123}
    """
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
    
    student_id = request.data.get('student_id')
    
    if not student_id:
        return Response({'error': 'student_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if already enrolled
    if StudentCourse.objects.filter(student_id=student_id, course=course).exists():
        return Response({'error': 'Student is already enrolled in this course'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create enrollment
    enrollment = StudentCourse.objects.create(student_id=student_id, course=course)
    serializer = StudentCourseSerializer(enrollment)
    
    return Response({
        'message': 'Student enrolled successfully',
        'enrollment': serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def unenroll_student(request, pk):
    """
    Unenroll a student from a course
    DELETE /api/courses/{id}/unenroll/
    Body: {"student_id": 123}
    """
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
    
    student_id = request.data.get('student_id')
    
    if not student_id:
        return Response({'error': 'student_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        enrollment = StudentCourse.objects.get(student_id=student_id, course=course)
        enrollment.delete()
        return Response({'message': 'Student unenrolled successfully'}, status=status.HTTP_200_OK)
    except StudentCourse.DoesNotExist:
        return Response({'error': 'Student is not enrolled in this course'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def course_students(request, pk):
    """
    Get all students enrolled in a course
    GET /api/courses/{id}/students/
    """
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
    
    enrollments = StudentCourse.objects.filter(course=course)
    serializer = StudentCourseSerializer(enrollments, many=True)
    
    return Response({
        'course_id': course.id,
        'course_name': course.name,
        'enrolled_students_count': enrollments.count(),
        'enrollments': serializer.data
    })


@api_view(['GET'])
def enrollment_list(request):
    """
    List all enrollments
    GET /api/enrollments/
    GET /api/enrollments/?student_id=123
    """
    student_id = request.GET.get('student_id', None)
    
    enrollments = StudentCourse.objects.all()
    
    if student_id:
        enrollments = enrollments.filter(student_id=student_id)
    
    serializer = StudentCourseSerializer(enrollments, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def enrollment_detail(request, pk):
    """
    Get details of a specific enrollment
    GET /api/enrollments/{id}/
    """
    try:
        enrollment = StudentCourse.objects.get(pk=pk)
    except StudentCourse.DoesNotExist:
        return Response({'error': 'Enrollment not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = StudentCourseSerializer(enrollment)
    return Response(serializer.data)


@api_view(['GET'])
def student_courses(request):
    """
    Get all courses a student is enrolled in
    GET /api/enrollments/by_student/?student_id=123
    """
    student_id = request.GET.get('student_id', None)
    
    if not student_id:
        return Response({'error': 'student_id query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    enrollments = StudentCourse.objects.filter(student_id=student_id)
    serializer = StudentCourseSerializer(enrollments, many=True)
    
    return Response({
        'student_id': student_id,
        'enrolled_courses_count': enrollments.count(),
        'enrollments': serializer.data
    })