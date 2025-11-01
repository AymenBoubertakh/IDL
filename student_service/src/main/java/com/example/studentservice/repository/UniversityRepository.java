package com.example.studentservice.repository;

import com.example.studentservice.model.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {
    
    Optional<University> findByName(String name);
    
    List<University> findByLocation(String location);
    
    List<University> findByNameContainingIgnoreCase(String name);
}