/**
 * Worker API Service — SevaSangam
 * Handles worker profiles, skills, availability, and verification.
 */
import apiClient from '../apiClient';

const workerApi = {
  getWorkers: (params) => apiClient.get('/workers', params),
  getWorkerById: (id) => apiClient.get(`/workers/${id}`),
  getNearbyWorkers: (params) => apiClient.get('/workers/nearby', params),
  updateSkills: (data) => apiClient.put('/workers/skills', data),
  updateAvailability: (data) => apiClient.put('/workers/availability', data),
  uploadCertificate: (formData) => apiClient.upload('/workers/certificates', formData),
  getCertificates: (workerId) => apiClient.get(`/workers/${workerId}/certificates`),
  getWorkerStats: (workerId) => apiClient.get(`/workers/${workerId}/stats`),
};

export default workerApi;
