export const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:9090';
export const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:9090/graphql';

export const ROUTES = {
  DASHBOARD: '/',
  STUDENTS: '/students',
  COURSES: '/courses',
  CHATBOT: '/chatbot',
  RELATIONS: '/relations',
};

export const LANGUAGE_CODES = {
  'en_XX': 'English',
  'fr_XX': 'French',
  'ar_AR': 'Arabic',
  'es_XX': 'Spanish',
  'de_DE': 'German',
  'it_IT': 'Italian',
  'pt_XX': 'Portuguese',
  'ru_RU': 'Russian',
  'zh_CN': 'Chinese',
  'ja_XX': 'Japanese',
  'ko_KR': 'Korean',
  'hi_IN': 'Hindi',
};