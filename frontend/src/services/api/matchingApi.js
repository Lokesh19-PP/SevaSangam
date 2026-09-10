/**
 * Matching API Service — SevaSangam
 * Handles AI-powered worker matching and recommendations.
 */
import apiClient from '../apiClient.js';

export const getMatchedWorkers = (params) => apiClient.post('/matching/workers', params);
export const getRecommendations = (serviceId, location = {}) =>
  apiClient.get('/matching/recommendations', { serviceId, ...location });

const matchingApi = {
  getMatchedWorkers,
  getRecommendations,
};

export default matchingApi;
