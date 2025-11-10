import { courseService } from '../services/courseService.js';
import { studentService } from '../services/studentService.js';

export const courseResolvers = {
  Query: {
    // Get single course
    course: async (_, { id }) => {
      return await courseService.getCourseById(id);
    },

    // Get all courses
    courses: async () => {
      return await courseService.getAllCourses();
    },

    // Search courses
    searchCourses: async (_, { keyword }) => {
      return await courseService.searchCourses(keyword);
    },

    // Get courses by category
    coursesByCategory: async (_, { category }) => {
      return await courseService.getCoursesByCategory(category);
    },

    // Get courses by instructor
    coursesByInstructor: async (_, { instructor }) => {
      return await courseService.getCoursesByInstructor(instructor);
    },

    // Get enrollments
    enrollments: async () => {
      return await courseService.getAllEnrollments();
    },

    // Get enrollments by student
    enrollmentsByStudent: async (_, { studentId }) => {
      return await courseService.getEnrollmentsByStudent(studentId);
    },

    // Get course with students (combined query)
    courseWithStudents: async (_, { id }) => {
      return await courseService.getCourseById(id);
    },
  },

  Course: {
    // Resolve students enrolled in a course
    students: async (parent) => {
      try {
        const enrollments = await courseService.getStudentsInCourse(parent.id);
        
        // Fetch full student details for each enrollment
        const studentPromises = enrollments.map(async (enrollment) => {
          return await studentService.getStudentById(enrollment.student_id);
        });
        
        const students = await Promise.all(studentPromises);
        return students.filter(student => student !== null);
      } catch (error) {
        console.error('Error resolving course students:', error.message);
        return [];
      }
    },
  },

  Enrollment: {
    // Resolve course for enrollment
    course: async (parent) => {
      return await courseService.getCourseById(parent.course);
    },
  },
};