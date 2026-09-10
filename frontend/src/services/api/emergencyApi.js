/**
 * Emergency API Service — SevaSangam
 * Handles emergency service requests and coordination.
 */
import apiClient from '../apiClient.js';

export const createEmergencyRequest = (data) => apiClient.post('/emergency', data);
export const getEmergencyStatus = (id) => apiClient.get(`/emergency/${id}`);
export const cancelEmergency = (id) => apiClient.post(`/emergency/${id}/cancel`);
export const getNearbyEmergencyWorkers = (params) => apiClient.get('/emergency/workers', params);

const emergencyApi = {
  createEmergencyRequest,
  getEmergencyStatus,
  cancelEmergency,
  getNearbyEmergencyWorkers,
};

export default emergencyApi;
