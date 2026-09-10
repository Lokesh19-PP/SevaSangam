/**
 * Booking API Service — SevaSangam
 * Handles booking creation, status tracking, and history.
 */
import apiClient from '../apiClient.js';

export const createBooking = (data) => apiClient.post('/bookings', data);
export const getBookings = (params) => apiClient.get('/bookings', params);
export const getBookingById = (id) => apiClient.get(`/bookings/${id}`);
export const getBookingsByUser = (userId) => apiClient.get(`/bookings/user/${userId}`);
export const updateBookingStatus = (id, status) => apiClient.patch(`/bookings/${id}/status`, { status });
export const cancelBooking = (id, reason) => apiClient.post(`/bookings/${id}/cancel`, { reason });
export const getBookingHistory = (params) => apiClient.get('/bookings/history', params);
export const getUpcomingBookings = (params) => apiClient.get('/bookings/upcoming', params);

const bookingApi = {
  createBooking,
  getBookings,
  getBookingById,
  getBookingsByUser,
  updateBookingStatus,
  cancelBooking,
  getBookingHistory,
  getUpcomingBookings,
};

export default bookingApi;
