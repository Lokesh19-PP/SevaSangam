/**
 * Service API — SevaSangam
 * Handles service categories, listings, and search.
 */
import apiClient from '../apiClient';

const serviceApi = {
  getServices: (params) => apiClient.get('/services', params),
  getServiceById: (id) => apiClient.get(`/services/${id}`),
  getCategories: () => apiClient.get('/services/categories'),
  searchServices: (query) => apiClient.get('/services/search', { q: query }),
  getPopularServices: () => apiClient.get('/services/popular'),
};

export default serviceApi;
