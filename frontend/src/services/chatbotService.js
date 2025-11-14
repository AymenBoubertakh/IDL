import api from './api';

export const chatbotService = {
  // Translate text
  translate: async (text, sourceLang, targetLang) => {
    const response = await api.post('/api/translate/', {
      text,
      source_lang: sourceLang,
      target_lang: targetLang,
    });
    return response.data;
  },

  // Summarize text
  summarize: async (text, maxLength = 150, minLength = 50) => {
    const response = await api.post('/api/summarize/', {
      text,
      max_length: maxLength,
      min_length: minLength,
    });
    return response.data;
  },

  // Get supported languages
  getSupportedLanguages: async () => {
    const response = await api.get('/api/languages/');
    return response.data;
  },
};