package com.example.demo.controller;

import com.example.demo.model.University;
import com.example.demo.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/university")
@CrossOrigin(origins = "http://localhost:3000")
public class UniversityController {
    @Autowired
    private UniversityService universityService;

    @PostMapping("/add")
    public String add(@RequestBody University university) {
        universityService.saveUniversity(university);
        return "New university is added";
    }

    @GetMapping("/getAll")
    public List<University> getAllUniversities() {
        return universityService.getAllUniversities();
    }
}
