import { studentService } from '../services/studentService.js';
import { courseService } from '../services/courseService.js';

export const studentResolvers = {
  Query: {
    // Get single student
    student: async (_, { id }) => {
      return await studentService.getStudentById(id);
    },

    // Get all students
    students: async () => {
      return await studentService.getAllStudents();
    },

    // Search students
    searchStudents: async (_, { keyword }) => {
      return await studentService.searchStudents(keyword);
    },

    // Get students by university
    studentsByUniversity: async (_, { universityId }) => {
      return await studentService.getStudentsByUniversity(universityId);
    },

    // Get student with courses (combined query)
    studentWithCourses: async (_, { id }) => {
      return await studentService.getStudentById(id);
    },
  },

  Student: {
    // Resolve courses for a student
    courses: async (parent) => {
      try {
        const enrollments = await courseService.getEnrollmentsByStudent(parent.id);
        
        // Fetch full course details for each enrollment
        const coursePromises = enrollments.map(async (enrollment) => {
          return await courseService.getCourseById(enrollment.course);
        });
        
        const courses = await Promise.all(coursePromises);
        return courses.filter(course => course !== null);
      } catch (error) {
        console.error('Error resolving student courses:', error.message);
        return [];
      }
    },

    // University is already included in student data from service
    university: (parent) => parent.university,
  },
};