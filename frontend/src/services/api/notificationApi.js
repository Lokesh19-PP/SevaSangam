/**
 * Notification API Service — SevaSangam
 * Handles in-app notifications and preferences.
 */
import apiClient from '../apiClient.js';

export const getNotifications = (params) => apiClient.get('/notifications', params);
export const markAsRead = (id) => apiClient.patch(`/notifications/${id}/read`);
export const markAllAsRead = () => apiClient.post('/notifications/read-all');
export const getUnreadCount = () => apiClient.get('/notifications/unread-count');
export const updatePreferences = (data) => apiClient.put('/notifications/preferences', data);

const notificationApi = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  updatePreferences,
};

export default notificationApi;
