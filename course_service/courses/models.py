from django.db import models

class Course(models.Model):
    """
    Course model representing a course in the system
    """
    name = models.CharField(max_length=200)
    instructor = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    schedule = models.TextField(help_text="Course schedule details")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'
    
    def __str__(self):
        return f"{self.name} - {self.instructor}"


class StudentCourse(models.Model):
    """
    StudentCourse model representing the many-to-many relationship
    between students and courses
    """
    student_id = models.IntegerField(help_text="ID of the student from Student Service")
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        related_name='enrollments'
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('student_id', 'course')
        ordering = ['-enrolled_at']
        verbose_name = 'Student Course Enrollment'
        verbose_name_plural = 'Student Course Enrollments'
    
    def __str__(self):
        return f"Student {self.student_id} - {self.course.name}"