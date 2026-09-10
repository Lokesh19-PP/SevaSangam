/**
 * Payment API Service — SevaSangam
 * Handles payment processing and records (mock initially).
 */
import apiClient from '../apiClient.js';

export const createPayment = (data) => apiClient.post('/payments', data);
export const getPaymentById = (id) => apiClient.get(`/payments/${id}`);
export const getPaymentHistory = (params) => apiClient.get('/payments/history', params);
export const updatePaymentStatus = (id, status) => apiClient.patch(`/payments/${id}`, { status });

const paymentApi = {
  createPayment,
  getPaymentById,
  getPaymentHistory,
  updatePaymentStatus,
};

export default paymentApi;
