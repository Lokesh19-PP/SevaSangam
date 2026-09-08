/**
 * useNotifications Hook — SevaSangam
 * Encapsulates notification-related API calls and state.
 */
import { useState, useCallback } from 'react';
import notificationApi from '../services/api/notificationApi';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await notificationApi.getNotifications(params);
      setNotifications(result.data || result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return { notifications, unreadCount, loading, error, fetchNotifications, markAsRead };
};

export default useNotifications;
