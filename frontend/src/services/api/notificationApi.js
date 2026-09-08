/**
 * Notification API Service — SevaSangam
 * Handles in-app notifications and preferences.
 */
import apiClient from '../apiClient';

const notificationApi = {
  getNotifications: (params) => apiClient.get('/notifications', params),
  markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.post('/notifications/read-all'),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  updatePreferences: (data) => apiClient.put('/notifications/preferences', data),
};

export default notificationApi;
