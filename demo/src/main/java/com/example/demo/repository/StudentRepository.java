package com.example.demo.repository;

import com.example.demo.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    // Récupérer tous les étudiants avec le nom de son université
    @Query("SELECT s.name, u.name FROM Student s, University u WHERE s.university.id = u.id")
    List<Object> getAllStudentsUniversity();

    // Trouver tous les étudiants inscrits à une université spécifique
    @Query("SELECT s.name, u.name FROM Student s, University u WHERE s.university.id = u.id AND u.name = :param")
    List<Object> findStudentsByUniversity(@Param("param") String univName);
}