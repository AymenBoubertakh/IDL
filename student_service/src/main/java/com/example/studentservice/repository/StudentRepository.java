package com.example.studentservice.repository;

import com.example.studentservice.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByEmail(String email);
    
    List<Student> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String firstName, String lastName);
    
    List<Student> findByUniversityId(Long universityId);
    
    @Query("SELECT s FROM Student s WHERE s.university.name = :universityName")
    List<Student> findByUniversityName(@Param("universityName") String universityName);
    
    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Student> searchStudents(@Param("keyword") String keyword);
}