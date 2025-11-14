package com.example.studentservice.controller;

import com.example.studentservice.model.University;
import com.example.studentservice.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/universities")
// @CrossOrigin removed - CORS is handled by API Gateway
public class UniversityController {
    
    @Autowired
    private UniversityService universityService;
    
    // Create a new university
    @PostMapping
    public ResponseEntity<University> createUniversity(@RequestBody University university) {
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
    public ResponseEntity<University> updateUniversity(@PathVariable Long id, @RequestBody University university) {
        try {
            University updatedUniversity = universityService.updateUniversity(id, university);
            return new ResponseEntity<>(updatedUniversity, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete university
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUniversity(@PathVariable Long id) {
        try {
            universityService.deleteUniversity(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}