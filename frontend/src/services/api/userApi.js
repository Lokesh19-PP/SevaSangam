/**
 * User API Service — SevaSangam
 * Handles user profile and account operations.
 */
import apiClient from '../apiClient.js';

export const getProfile = () => apiClient.get('/users/profile');
export const updateProfile = (data) => apiClient.put('/users/profile', data);
export const changePassword = (data) => apiClient.post('/users/change-password', data);
export const uploadAvatar = (formData) => apiClient.upload('/users/avatar', formData);
export const getUsers = (params) => apiClient.get('/users', params);
export const getUserById = (id) => apiClient.get(`/users/${id}`);

const userApi = {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  getUsers,
  getUserById,
};

export default userApi;
