package com.example.demo.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL)
    private List<Student> students;

    public University() {}

    public int getId() { return id; }
    public String getName() { return name; }

    public void setId(int id) { this.id = id; }
    public void setName(String name) { this.name = name; }
}