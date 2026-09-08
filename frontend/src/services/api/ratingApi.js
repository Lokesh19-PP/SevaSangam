/**
 * Rating API Service — SevaSangam
 * Handles ratings, reviews, and feedback.
 */
import apiClient from '../apiClient';

const ratingApi = {
  submitRating: (data) => apiClient.post('/ratings', data),
  getRatings: (params) => apiClient.get('/ratings', params),
  getWorkerRatings: (workerId) => apiClient.get(`/ratings/worker/${workerId}`),
  getBookingRating: (bookingId) => apiClient.get(`/ratings/booking/${bookingId}`),
};

export default ratingApi;
