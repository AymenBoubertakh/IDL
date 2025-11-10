import axios from 'axios';
import { CONFIG } from '../config/constants.js';

const BASE_URL = CONFIG.CHATBOT_SERVICE_URL;

export const chatbotService = {
  // Translate text
  async translate(text, sourceLang, targetLang) {
    try {
      const response = await axios.post(`${BASE_URL}/api/translate/`, {
        text,
        source_lang: sourceLang,
        target_lang: targetLang
      });
      return response.data;
    } catch (error) {
      console.error('Error translating text:', error.message);
      throw new Error('Failed to translate text');
    }
  },

  // Summarize text
  async summarize(text, maxLength = 150, minLength = 50) {
    try {
      const response = await axios.post(`${BASE_URL}/api/summarize/`, {
        text,
        max_length: maxLength,
        min_length: minLength
      });
      return response.data;
    } catch (error) {
      console.error('Error summarizing text:', error.message);
      throw new Error('Failed to summarize text');
    }
  },

  // Get supported languages
  async getSupportedLanguages() {
    try {
      const response = await axios.get(`${BASE_URL}/api/languages/`);
      const languagesData = response.data;
      
      // Convert object to array format
      const languagesArray = Object.entries(languagesData.languages).map(([code, name]) => ({
        code,
        name
      }));
      
      return {
        languages: languagesArray,
        count: languagesData.count
      };
    } catch (error) {
      console.error('Error fetching supported languages:', error.message);
      throw new Error('Failed to fetch supported languages');
    }
  },
};