import api from './api';

export const authService = {
  login: (email, password) => api.post('/v1/auth/login', { email, password }),
  signup: (userData) => api.post('/v1/auth/signup', userData),
  getProfile: () => api.get('/v1/auth/profile'),
  // Add other auth-related API calls
};