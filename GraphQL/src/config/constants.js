import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 8002,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Microservices URLs
  STUDENT_SERVICE_URL: process.env.STUDENT_SERVICE_URL || 'http://localhost:8081',
  COURSE_SERVICE_URL: process.env.COURSE_SERVICE_URL || 'http://localhost:8000',
  CHATBOT_SERVICE_URL: process.env.CHATBOT_SERVICE_URL || 'http://localhost:8001',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};