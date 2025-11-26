package com.example.studentservice.controller;

import com.example.studentservice.model.University;
import com.example.studentservice.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/universities")
// @CrossOrigin removed - CORS is handled by API Gateway
public class UniversityController {
    
    @Autowired
    private UniversityService universityService;
    
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
    
    // Create a new university
    @PostMapping
    public ResponseEntity<?> createUniversity(@RequestBody University university, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return forbiddenResponse("Access denied: Admin role required");
        }
        University savedUniversity = universityService.saveUniversity(university);
        return new ResponseEntity<>(savedUniversity, HttpStatus.CREATED);
    }
    
    // Get all universities
    @GetMapping
    public ResponseEntity<List<University>> getAllUniversities() {
        List<University> universities = universityService.getAllUniversities();
        return new ResponseEntity<>(universities, HttpStatus.OK);
    }
    
    // Get university by ID
    @GetMapping("/{id}")
    public ResponseEntity<University> getUniversityById(@PathVariable Long id) {
        return universityService.getUniversityById(id)
                .map(university -> new ResponseEntity<>(university, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // Search universities by name
    @GetMapping("/search")
    public ResponseEntity<List<University>> searchUniversities(@RequestParam String name) {
        List<University> universities = universityService.searchUniversitiesByName(name);
        return new ResponseEntity<>(universities, HttpStatus.OK);
    }
    
    // Get universities by location
    @GetMapping("/location/{location}")
    public ResponseEntity<List<University>> getUniversitiesByLocation(@PathVariable String location) {
        List<University> universities = universityService.getUniversitiesByLocation(location);
        return new ResponseEntity<>(universities, HttpStatus.OK);
    }
    
    // Update university
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUniversity(@PathVariable Long id, @RequestBody University university, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return forbiddenResponse("Access denied: Admin role required");
        }
        try {
            University updatedUniversity = universityService.updateUniversity(id, university);
            return new ResponseEntity<>(updatedUniversity, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete university
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUniversity(@PathVariable Long id, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return forbiddenResponse("Access denied: Admin role required");
        }
        try {
            universityService.deleteUniversity(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}