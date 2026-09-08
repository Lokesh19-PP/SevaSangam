/**
 * Emergency API Service — SevaSangam
 * Handles emergency service requests and coordination.
 */
import apiClient from '../apiClient';

const emergencyApi = {
  createEmergencyRequest: (data) => apiClient.post('/emergency', data),
  getEmergencyStatus: (id) => apiClient.get(`/emergency/${id}`),
  cancelEmergency: (id) => apiClient.post(`/emergency/${id}/cancel`),
  getNearbyEmergencyWorkers: (params) => apiClient.get('/emergency/workers', params),
};

export default emergencyApi;
