import api from './api';

export const courseService = {
  // Get all courses
  getAllCourses: async () => {
    const response = await api.get('/api/courses/');
    return response.data;
  },

  // Get course by ID
  getCourseById: async (id) => {
    const response = await api.get(`/api/courses/${id}/`);
    return response.data;
  },

  // Create course
  createCourse: async (courseData) => {
    const response = await api.post('/api/courses/', courseData);
    return response.data;
  },

  // Update course
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/api/courses/${id}/`, courseData);
    return response.data;
  },

  // Delete course
  deleteCourse: async (id) => {
    const response = await api.delete(`/api/courses/${id}/`);
    return response.data;
  },

  // Search courses
  searchCourses: async (keyword) => {
    const response = await api.get('/api/courses/', {
      params: { search: keyword },
    });
    return response.data;
  },

  // Filter by category
  getCoursesByCategory: async (category) => {
    const response = await api.get('/api/courses/', {
      params: { category },
    });
    return response.data;
  },

  // Filter by instructor
  getCoursesByInstructor: async (instructor) => {
    const response = await api.get('/api/courses/', {
      params: { instructor },
    });
    return response.data;
  },

  // Enroll student
  enrollStudent: async (courseId, studentId) => {
    const response = await api.post(`/api/courses/${courseId}/enroll/`, {
      student_id: studentId,
    });
    return response.data;
  },

  // Unenroll student
  unenrollStudent: async (courseId, studentId) => {
    const response = await api.delete(`/api/courses/${courseId}/unenroll/`, {
      data: { student_id: studentId },
    });
    return response.data;
  },

  // Get enrollments
  getAllEnrollments: async () => {
    const response = await api.get('/api/enrollments/');
    return response.data;
  },

  // Get enrollments by student
  getEnrollmentsByStudent: async (studentId) => {
    const response = await api.get('/api/enrollments/', {
      params: { student_id: studentId },
    });
    return response.data;
  },
};