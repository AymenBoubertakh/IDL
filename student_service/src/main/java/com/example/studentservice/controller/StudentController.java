package com.example.studentservice.controller;

import com.example.studentservice.model.Student;
import com.example.studentservice.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {
    
    @Autowired
    private StudentService studentService;
    
    // Create a new student
    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        try {
            Student savedStudent = studentService.createStudent(student);
            return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get all students
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return new ResponseEntity<>(students, HttpStatus.OK);
    }
    
    // Get student by ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id)
                .map(student -> new ResponseEntity<>(student, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // Get student by email
    @GetMapping("/email/{email}")
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        return studentService.getStudentByEmail(email)
                .map(student -> new ResponseEntity<>(student, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // Search students by name, ID, or university
    @GetMapping("/search")
    public ResponseEntity<List<Student>> searchStudents(@RequestParam String keyword) {
        List<Student> students = studentService.searchStudents(keyword);
        return new ResponseEntity<>(students, HttpStatus.OK);
    }
    
    // Filter students by university ID
    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<Student>> getStudentsByUniversity(@PathVariable Long universityId) {
        List<Student> students = studentService.getStudentsByUniversityId(universityId);
        return new ResponseEntity<>(students, HttpStatus.OK);
    }
    
    // Filter students by university name
    @GetMapping("/university/name/{universityName}")
    public ResponseEntity<List<Student>> getStudentsByUniversityName(@PathVariable String universityName) {
        List<Student> students = studentService.getStudentsByUniversityName(universityName);
        return new ResponseEntity<>(students, HttpStatus.OK);
    }
    
    // Update student
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student student) {
        try {
            Student updatedStudent = studentService.updateStudent(id, student);
            return new ResponseEntity<>(updatedStudent, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Associate student with university
    @PutMapping("/{studentId}/university/{universityId}")
    public ResponseEntity<Student> associateStudentWithUniversity(
            @PathVariable Long studentId, 
            @PathVariable Long universityId) {
        try {
            Student student = studentService.associateStudentWithUniversity(studentId, universityId);
            return new ResponseEntity<>(student, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}