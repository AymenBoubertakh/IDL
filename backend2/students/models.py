from django.db import models

class University(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class Student(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name='students', null=True, blank=True)
    
    def __str__(self):
        return self.name
