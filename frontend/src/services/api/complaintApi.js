/**
 * Complaint API Service — SevaSangam
 * Handles complaint submission, tracking, and resolution.
 */
import apiClient from '../apiClient';

const complaintApi = {
  submitComplaint: (data) => apiClient.post('/complaints', data),
  getComplaints: (params) => apiClient.get('/complaints', params),
  getComplaintById: (id) => apiClient.get(`/complaints/${id}`),
  updateComplaintStatus: (id, data) => apiClient.patch(`/complaints/${id}`, data),
  addResponse: (id, response) => apiClient.post(`/complaints/${id}/response`, response),
};

export default complaintApi;
