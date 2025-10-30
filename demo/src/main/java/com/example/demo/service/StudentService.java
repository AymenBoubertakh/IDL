package com.example.demo.service;

import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    
    public List<Object> getAllStudentsUniversity() {
        return studentRepository.getAllStudentsUniversity();
    }

    public List<Object> findStudentsByUniversity(String univName) {
        return studentRepository.findStudentsByUniversity(univName);
    }
}