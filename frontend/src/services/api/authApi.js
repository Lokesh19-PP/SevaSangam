/**
 * Auth API Service — SevaSangam
 * Handles authentication: login, register, logout, password reset.
 */
import apiClient from '../apiClient.js';

export const login = (credentials) => apiClient.post('/auth/login', credentials);
export const register = (userData) => apiClient.post('/auth/register', userData);
export const logout = () => apiClient.post('/auth/logout');
export const refreshToken = () => apiClient.post('/auth/refresh');
export const forgotPassword = (email) => apiClient.post('/auth/forgot-password', { email });
export const resetPassword = (data) => apiClient.post('/auth/reset-password', data);
export const verifyEmail = (token) => apiClient.post('/auth/verify-email', { token });

const authApi = {
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
};

export default authApi;
