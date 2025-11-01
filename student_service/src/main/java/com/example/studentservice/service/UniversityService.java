package com.example.studentservice.service;

import com.example.studentservice.model.University;
import com.example.studentservice.repository.UniversityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UniversityService {
    
    @Autowired
    private UniversityRepository universityRepository;
    
    // Create or Update University
    public University saveUniversity(University university) {
        return universityRepository.save(university);
    }
    
    // Get all universities
    public List<University> getAllUniversities() {
        return universityRepository.findAll();
    }
    
    // Get university by ID
    public Optional<University> getUniversityById(Long id) {
        return universityRepository.findById(id);
    }
    
    // Get university by name
    public Optional<University> getUniversityByName(String name) {
        return universityRepository.findByName(name);
    }
    
    // Search universities by name
    public List<University> searchUniversitiesByName(String name) {
        return universityRepository.findByNameContainingIgnoreCase(name);
    }
    
    // Get universities by location
    public List<University> getUniversitiesByLocation(String location) {
        return universityRepository.findByLocation(location);
    }
    
    // Delete university
    public void deleteUniversity(Long id) {
        universityRepository.deleteById(id);
    }
    
    // Update university
    public University updateUniversity(Long id, University universityDetails) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found with id: " + id));
        
        university.setName(universityDetails.getName());
        university.setLocation(universityDetails.getLocation());
        
        return universityRepository.save(university);
    }
}