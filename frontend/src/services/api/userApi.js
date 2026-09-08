/**
 * User API Service — SevaSangam
 * Handles user profile and account operations.
 */
import apiClient from '../apiClient';

const userApi = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  changePassword: (data) => apiClient.post('/users/change-password', data),
  uploadAvatar: (formData) => apiClient.upload('/users/avatar', formData),
  getUsers: (params) => apiClient.get('/users', params),
  getUserById: (id) => apiClient.get(`/users/${id}`),
};

export default userApi;
