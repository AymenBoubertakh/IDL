import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const AUTH_API_URL = `${API_BASE_URL}/api/auth`;

export const authService = {
  // Login
  login: async (credentials) => {
    const response = await axios.post(`${AUTH_API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await axios.post(`${AUTH_API_URL}/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'ADMIN';
  },

  // Get user info from server
  getMe: async () => {
    const token = authService.getToken();
    const response = await axios.get(`${AUTH_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },
};
