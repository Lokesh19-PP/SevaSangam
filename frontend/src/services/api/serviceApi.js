/**
 * Service API — SevaSangam
 * Handles service categories, listings, and search.
 */
import apiClient from '../apiClient.js';

export const getServices = (params) => apiClient.get('/services', params);
export const getServiceById = (id) => apiClient.get(`/services/${id}`);
export const getCategories = () => apiClient.get('/services/categories');
export const searchServices = (query) => apiClient.get('/services/search', { q: query });
export const getPopularServices = () => apiClient.get('/services/popular');

const serviceApi = {
  getServices,
  getServiceById,
  getCategories,
  searchServices,
  getPopularServices,
};

export default serviceApi;
