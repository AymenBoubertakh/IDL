import axios from 'axios';
import { CONFIG } from '../config/constants.js';

const BASE_URL = CONFIG.COURSE_SERVICE_URL;

export const courseService = {
  // Get all courses
  async getAllCourses() {
    try {
      const response = await axios.get(`${BASE_URL}/api/courses/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error.message);
      throw new Error('Failed to fetch courses');
    }
  },

  // Get course by ID
  async getCourseById(id) {
    try {
      const response = await axios.get(`${BASE_URL}/api/courses/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error.message);
      return null;
    }
  },

  // Search courses
  async searchCourses(keyword) {
    try {
      const response = await axios.get(`${BASE_URL}/api/courses/`, {
        params: { search: keyword }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching courses:', error.message);
      return [];
    }
  },

  // Get courses by category
  async getCoursesByCategory(category) {
    try {
      const response = await axios.get(`${BASE_URL}/api/courses/`, {
        params: { category }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching courses by category:', error.message);
      return [];
    }
  },

  // Get courses by instructor
  async getCoursesByInstructor(instructor) {
    try {
      const response = await axios.get(`${BASE_URL}/api/courses/`, {
        params: { instructor }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching courses by instructor:', error.message);
      return [];
    }
  },

  // Get all enrollments
  async getAllEnrollments() {
    try {
      const response = await axios.get(`${BASE_URL}/api/enrollments/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollments:', error.message);
      throw new Error('Failed to fetch enrollments');
    }
  },

  // Get enrollments by student
  async getEnrollmentsByStudent(studentId) {
    try {
      const response = await axios.get(`${BASE_URL}/api/enrollments/`, {
        params: { student_id: studentId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollments by student:', error.message);
      return [];
    }
  },

  // Get students enrolled in a course
  async getStudentsInCourse(courseId) {
    try {
      const response = await axios.get(`${BASE_URL}/api/courses/${courseId}/students/`);
      return response.data.enrollments || [];
    } catch (error) {
      console.error('Error fetching students in course:', error.message);
      return [];
    }
  },
};