import { studentResolvers } from './studentResolver.js';
import { courseResolvers } from './courseResolver.js';
import { universityResolvers } from './universityResolver.js';
import { chatbotService } from '../services/chatbotService.js';

// Merge all resolvers
export const resolvers = {
  Query: {
    ...studentResolvers.Query,
    ...courseResolvers.Query,
    ...universityResolvers.Query,

    // Chatbot queries
    translate: async (_, { text, sourceLang, targetLang }) => {
      return await chatbotService.translate(text, sourceLang, targetLang);
    },

    summarize: async (_, { text, maxLength, minLength }) => {
      return await chatbotService.summarize(text, maxLength, minLength);
    },

    supportedLanguages: async () => {
      return await chatbotService.getSupportedLanguages();
    },
  },

  Student: studentResolvers.Student,
  Course: courseResolvers.Course,
  University: universityResolvers.University,
  Enrollment: courseResolvers.Enrollment,
};