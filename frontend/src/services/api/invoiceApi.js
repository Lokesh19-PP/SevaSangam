/**
 * Invoice API Service — SevaSangam
 * Handles invoice generation and retrieval.
 */
import apiClient from '../apiClient.js';

export const generateInvoice = (bookingId) => apiClient.post(`/invoices/generate/${bookingId}`);
export const getInvoiceById = (id) => apiClient.get(`/invoices/${id}`);
export const getInvoices = (params) => apiClient.get('/invoices', params);
export const downloadInvoice = (id) => apiClient.get(`/invoices/${id}/download`);

const invoiceApi = {
  generateInvoice,
  getInvoiceById,
  getInvoices,
  downloadInvoice,
};

export default invoiceApi;
