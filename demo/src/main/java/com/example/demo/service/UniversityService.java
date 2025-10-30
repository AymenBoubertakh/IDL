package com.example.demo.service;

import com.example.demo.model.University;
import com.example.demo.repository.UniversityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UniversityService {
    @Autowired
    private UniversityRepository universityRepository;

    public University saveUniversity(University university) {
        return universityRepository.save(university);
    }

    public List<University> getAllUniversities() {
        return universityRepository.findAll();
    }
}