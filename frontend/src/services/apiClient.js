/**
 * API Client — SevaSangam
 * 
 * Central HTTP client for all API calls.
 * 
 * Architecture:
 *   React Component → Custom Hook → API Service → apiClient → Backend
 * 
 * In development (VITE_USE_MOCK_API=true), requests are intercepted
 * by mockApi.js. In production, they go to the FastAPI backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

/**
 * Get the auth token from storage.
 * Will be replaced with actual auth provider logic later.
 */
const getAuthToken = () => {
  return localStorage.getItem('sevasangam_token');
};

/**
 * Build request headers.
 */
const buildHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Handle API response.
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unexpected error occurred',
    }));
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }
  return response.json();
};

/**
 * Core API client methods.
 */
const apiClient = {
  /**
   * GET request
   */
  get: async (endpoint, params = {}) => {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: buildHeaders(),
    });

    return handleResponse(response);
  },

  /**
   * POST request
   */
  post: async (endpoint, data = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  /**
   * PUT request
   */
  put: async (endpoint, data = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  /**
   * PATCH request
   */
  patch: async (endpoint, data = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  /**
   * DELETE request
   */
  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });

    return handleResponse(response);
  },

  /**
   * Upload file (multipart/form-data)
   */
  upload: async (endpoint, formData) => {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return handleResponse(response);
  },
};

export default apiClient;
export { API_BASE_URL, USE_MOCK_API };
