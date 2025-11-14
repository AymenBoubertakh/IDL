import api from './api';

export const studentService = {
  // Get all students
  getAllStudents: async () => {
    const response = await api.get('/api/students');
    return response.data;
  },

  // Get student by ID
  getStudentById: async (id) => {
    const response = await api.get(`/api/students/${id}`);
    return response.data;
  },

  // Create student
  createStudent: async (studentData) => {
    const response = await api.post('/api/students', studentData);
    return response.data;
  },

  // Update student
  updateStudent: async (id, studentData) => {
    const response = await api.put(`/api/students/${id}`, studentData);
    return response.data;
  },

  // Delete student
  deleteStudent: async (id) => {
    const response = await api.delete(`/api/students/${id}`);
    return response.data;
  },

  // Search students
  searchStudents: async (keyword) => {
    const response = await api.get('/api/students/search', {
      params: { keyword },
    });
    return response.data;
  },

  // Get students by university
  getStudentsByUniversity: async (universityId) => {
    const response = await api.get(`/api/students/university/${universityId}`);
    return response.data;
  },

  // Get all universities
  getAllUniversities: async () => {
    const response = await api.get('/api/universities');
    return response.data;
  },

  // Create university
  createUniversity: async (universityData) => {
    const response = await api.post('/api/universities', universityData);
    return response.data;
  },
};