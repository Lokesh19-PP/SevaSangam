/**
 * Matching API Service — SevaSangam
 * Handles AI-powered worker matching and recommendations.
 */
import apiClient from '../apiClient';

const matchingApi = {
  getMatchedWorkers: (params) => apiClient.post('/matching/workers', params),
  getRecommendations: (serviceId, location) =>
    apiClient.get('/matching/recommendations', { serviceId, ...location }),
};

export default matchingApi;
