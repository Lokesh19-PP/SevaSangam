/**
 * Rating API Service — SevaSangam
 * Handles ratings, reviews, and feedback.
 */
import apiClient from '../apiClient.js';

export const submitRating = (data) => apiClient.post('/ratings', data);
export const getRatings = (params) => apiClient.get('/ratings', params);
export const getWorkerRatings = (workerId) => apiClient.get(`/ratings/worker/${workerId}`);
export const getBookingRating = (bookingId) => apiClient.get(`/ratings/booking/${bookingId}`);

const ratingApi = {
  submitRating,
  getRatings,
  getWorkerRatings,
  getBookingRating,
};

export default ratingApi;
