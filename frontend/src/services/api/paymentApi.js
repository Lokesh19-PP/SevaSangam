/**
 * Payment API Service — SevaSangam
 * Handles payment processing and records (mock initially).
 */
import apiClient from '../apiClient';

const paymentApi = {
  createPayment: (data) => apiClient.post('/payments', data),
  getPaymentById: (id) => apiClient.get(`/payments/${id}`),
  getPaymentHistory: (params) => apiClient.get('/payments/history', params),
  updatePaymentStatus: (id, status) => apiClient.patch(`/payments/${id}`, { status }),
};

export default paymentApi;
