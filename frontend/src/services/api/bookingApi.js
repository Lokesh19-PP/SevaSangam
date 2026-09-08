/**
 * Booking API Service — SevaSangam
 * Handles booking creation, status tracking, and history.
 */
import apiClient from '../apiClient';

const bookingApi = {
  createBooking: (data) => apiClient.post('/bookings', data),
  getBookings: (params) => apiClient.get('/bookings', params),
  getBookingById: (id) => apiClient.get(`/bookings/${id}`),
  updateBookingStatus: (id, status) => apiClient.patch(`/bookings/${id}/status`, { status }),
  cancelBooking: (id, reason) => apiClient.post(`/bookings/${id}/cancel`, { reason }),
  getBookingHistory: (params) => apiClient.get('/bookings/history', params),
  getUpcomingBookings: () => apiClient.get('/bookings/upcoming'),
};

export default bookingApi;
