import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export default function Student() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [students, setStudents] = useState([]);
  const [universities, setUniversities] = useState([]);

  // Fetch students function
  const fetchStudents = () => {
    fetch("http://localhost:8081/student/getAll", {
      method: "GET"
    })
      .then(res => res.json())
      .then((result) => {
        setStudents(result);
        console.log("Students fetched:", result);
      })
      .catch(error => console.error("Error fetching students:", error));
  };

  // Fetch universities and students on component mount
  useEffect(() => {
    // Fetch universities
    fetch("http://localhost:8081/university/getAll", {
      method: "GET"
    })
      .then(res => res.json())
      .then((result) => {
        setUniversities(result);
        console.log("Universities fetched:", result);
      })
      .catch(error => console.error("Error fetching universities:", error));

    // Fetch students
    fetchStudents();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    
    // Find the selected university object
    const selectedUniversity = universities.find(u => u.id === universityId);
    
    if (!selectedUniversity) {
      alert("Please select a university");
      return;
    }

    const student = { 
      name, 
      address,
      university: selectedUniversity
    };

    fetch("http://localhost:8081/student/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student)
    })
      .then(response => {
        if (response.ok) {
          console.log("New student added");
          // Clear form
          setName('');
          setAddress('');
          setUniversityId('');
          // Refresh students list
          fetchStudents();
        } else {
          console.error("Error adding student");
        }
      })
      .catch(error => console.error("Error:", error));
  };

  const paperStyle = { padding: '50px 20px', width: 600, margin: '50px auto' };

  return (
    <Container>
      <Paper elevation={3} style={paperStyle}>
        <form>
          <div style={{ margin: 10 }}>
            <TextField
              id="outlined-nom"
              label="Nom"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div style={{ margin: 10 }}>
            <TextField
              id="outlined-address"
              label="Adresse"
              variant="outlined"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div style={{ margin: 10 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="university-label">Université</InputLabel>
              <Select
                labelId="university-label"
                id="university-select"
                value={universityId}
                label="Université"
                onChange={(e) => setUniversityId(e.target.value)}
              >
                {universities.map((university) => (
                  <MenuItem key={university.id} value={university.id}>
                    {university.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Button variant="contained" onClick={handleClick}>
            Ajouter
          </Button>
        </form>
      </Paper>

      <h1>Students</h1>
      {students.map(student => (
        <Paper
          elevation={6}
          style={{ margin: "10px", padding: "15px", textAlign: "left" }}
          key={student.id}
        >
          Id: {student.id}<br />
          Name: {student.name}<br />
          Address: {student.address}<br />
          University: {student.university ? student.university.name : 'N/A'}
        </Paper>
      ))}
    </Container>
  );
}
