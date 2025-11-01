package com.example.studentservice.service;

import com.example.studentservice.model.Student;
import com.example.studentservice.model.University;
import com.example.studentservice.repository.StudentRepository;
import com.example.studentservice.repository.UniversityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private UniversityRepository universityRepository;
    
    // Create student
    public Student createStudent(Student student) {
        // Validate that university exists
        if (student.getUniversity() != null && student.getUniversity().getId() != null) {
            University university = universityRepository.findById(student.getUniversity().getId())
                    .orElseThrow(() -> new RuntimeException("University not found"));
            student.setUniversity(university);
        }
        return studentRepository.save(student);
    }
    
    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    
    // Get student by ID
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }
    
    // Get student by email
    public Optional<Student> getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }
    
    // Search students by name
    public List<Student> searchStudentsByName(String name) {
        return studentRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
    }
    
    // Search students by keyword (name, email)
    public List<Student> searchStudents(String keyword) {
        return studentRepository.searchStudents(keyword);
    }
    
    // Get students by university ID
    public List<Student> getStudentsByUniversityId(Long universityId) {
        return studentRepository.findByUniversityId(universityId);
    }
    
    // Get students by university name
    public List<Student> getStudentsByUniversityName(String universityName) {
        return studentRepository.findByUniversityName(universityName);
    }
    
    // Update student
    public Student updateStudent(Long id, Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        
        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setEmail(studentDetails.getEmail());
        
        // Update university if provided
        if (studentDetails.getUniversity() != null && studentDetails.getUniversity().getId() != null) {
            University university = universityRepository.findById(studentDetails.getUniversity().getId())
                    .orElseThrow(() -> new RuntimeException("University not found"));
            student.setUniversity(university);
        }
        
        return studentRepository.save(student);
    }
    
    // Delete student
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
    
    // Associate student with university
    public Student associateStudentWithUniversity(Long studentId, Long universityId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        University university = universityRepository.findById(universityId)
                .orElseThrow(() -> new RuntimeException("University not found"));
        
        student.setUniversity(university);
        return studentRepository.save(student);
    }
}