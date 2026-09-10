/**
 * Worker API Service — SevaSangam
 * Handles worker profiles, skills, availability, and verification.
 */
import apiClient from '../apiClient.js';

export const getWorkers = (params) => apiClient.get('/workers', params);
export const getWorkerById = (id) => apiClient.get(`/workers/${id}`);
export const getNearbyWorkers = (params) => apiClient.get('/workers/nearby', params);
export const updateSkills = (data) => apiClient.put('/workers/skills', data);
export const updateAvailability = (data) => apiClient.put('/workers/availability', data);
export const uploadCertificate = (formData) => apiClient.upload('/workers/certificates', formData);
export const getCertificates = (workerId) => apiClient.get(`/workers/${workerId}/certificates`);
export const getWorkerStats = (workerId) => apiClient.get(`/workers/${workerId}/stats`);

const workerApi = {
  getWorkers,
  getWorkerById,
  getNearbyWorkers,
  updateSkills,
  updateAvailability,
  uploadCertificate,
  getCertificates,
  getWorkerStats,
};

export default workerApi;
