/**
 * Complaint API Service — SevaSangam
 * Handles complaint submission, tracking, and resolution.
 */
import apiClient from '../apiClient.js';

export const submitComplaint = (data) => apiClient.post('/complaints', data);
export const getComplaints = (params) => apiClient.get('/complaints', params);
export const getComplaintById = (id) => apiClient.get(`/complaints/${id}`);
export const updateComplaintStatus = (id, data) => apiClient.patch(`/complaints/${id}`, data);
export const addResponse = (id, response) => apiClient.post(`/complaints/${id}/response`, response);

const complaintApi = {
  submitComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  addResponse,
};

export default complaintApi;
