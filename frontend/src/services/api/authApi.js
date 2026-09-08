/**
 * Auth API Service — SevaSangam
 * Handles authentication: login, register, logout, password reset.
 */
import apiClient from '../apiClient';

const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: () => apiClient.post('/auth/refresh'),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
  verifyEmail: (token) => apiClient.post('/auth/verify-email', { token }),
};

export default authApi;
