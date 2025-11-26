package com.example.studentservice.controller;

import com.example.studentservice.model.Student;
import com.example.studentservice.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
// @CrossOrigin removed - CORS is handled by API Gateway
public class StudentController {
    
    @Autowired
    private StudentService studentService;
    
    // Helper methods for role-based access control
    private boolean isAdmin(HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        return "ADMIN".equals(role);
    }
    
    private ResponseEntity<Map<String, String>> forbiddenResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }
    
    // Create a new student
    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody Student student, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return forbiddenResponse("Access denied: Admin role required");
        }
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
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Student student, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return forbiddenResponse("Access denied: Admin role required");
        }
        try {
            Student updatedStudent = studentService.updateStudent(id, student);
            return new ResponseEntity<>(updatedStudent, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return forbiddenResponse("Access denied: Admin role required");
        }
        try {
            studentService.deleteStudent(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Associate student with university
    @PutMapping("/{studentId}/university/{universityId}")
    public ResponseEntity<?> associateStudentWithUniversity(
            @PathVariable Long studentId, 
            @PathVariable Long universityId,
            HttpServletRequest request) {
        if (!isAdmin(request)) {
            return forbiddenResponse("Access denied: Admin role required");
        }
        try {
            Student student = studentService.associateStudentWithUniversity(studentId, universityId);
            return new ResponseEntity<>(student, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}