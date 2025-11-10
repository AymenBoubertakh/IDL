import axios from 'axios';
import { CONFIG } from '../config/constants.js';

const BASE_URL = CONFIG.STUDENT_SERVICE_URL;

export const studentService = {
  // Get all students
  async getAllStudents() {
    try {
      const response = await axios.get(`${BASE_URL}/api/students`);
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error.message);
      throw new Error('Failed to fetch students');
    }
  },

  // Get student by ID
  async getStudentById(id) {
    try {
      const response = await axios.get(`${BASE_URL}/api/students/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error.message);
      return null;
    }
  },

  // Search students
  async searchStudents(keyword) {
    try {
      const response = await axios.get(`${BASE_URL}/api/students/search`, {
        params: { keyword }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching students:', error.message);
      return [];
    }
  },

  // Get students by university
  async getStudentsByUniversity(universityId) {
    try {
      const response = await axios.get(`${BASE_URL}/api/students/university/${universityId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching students by university:', error.message);
      return [];
    }
  },

  // Get all universities
  async getAllUniversities() {
    try {
      const response = await axios.get(`${BASE_URL}/api/universities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching universities:', error.message);
      throw new Error('Failed to fetch universities');
    }
  },

  // Get university by ID
  async getUniversityById(id) {
    try {
      const response = await axios.get(`${BASE_URL}/api/universities/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching university ${id}:`, error.message);
      return null;
    }
  },

  // Search universities
  async searchUniversities(name) {
    try {
      const response = await axios.get(`${BASE_URL}/api/universities/search`, {
        params: { name }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching universities:', error.message);
      return [];
    }
  },
};