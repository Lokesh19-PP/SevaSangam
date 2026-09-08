/**
 * Invoice API Service — SevaSangam
 * Handles invoice generation and retrieval.
 */
import apiClient from '../apiClient';

const invoiceApi = {
  generateInvoice: (bookingId) => apiClient.post(`/invoices/generate/${bookingId}`),
  getInvoiceById: (id) => apiClient.get(`/invoices/${id}`),
  getInvoices: (params) => apiClient.get('/invoices', params),
  downloadInvoice: (id) => apiClient.get(`/invoices/${id}/download`),
};

export default invoiceApi;
