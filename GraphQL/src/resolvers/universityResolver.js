import { studentService } from '../services/studentService.js';

export const universityResolvers = {
  Query: {
    // Get single university
    university: async (_, { id }) => {
      return await studentService.getUniversityById(id);
    },

    // Get all universities
    universities: async () => {
      return await studentService.getAllUniversities();
    },

    // Search universities
    searchUniversities: async (_, { name }) => {
      return await studentService.searchUniversities(name);
    },
  },

  University: {
    // Resolve students for a university
    students: async (parent) => {
      try {
        return await studentService.getStudentsByUniversity(parent.id);
      } catch (error) {
        console.error('Error resolving university students:', error.message);
        return [];
      }
    },
  },
};