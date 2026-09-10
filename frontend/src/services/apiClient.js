/**
 * API Client — SevaSangam
 * 
 * Central HTTP client and API abstraction layer.
 * 
 * Architecture:
 *   React Component → Custom Hook → API Service (services/api/*.js) → apiClient → Backend
 * 
 * In development (or when VITE_USE_MOCK_API is true/not set to 'false'),
 * requests are intercepted and handled by mockApi.js with realistic latency.
 * When pointing to the real FastAPI backend, apiClient executes real fetch()
 * calls with JWT authentication, consistent headers, and error handling.
 * Callers (hooks, domain API services, components) require ZERO changes
 * when switching between mock and real production backends.
 */

import mockApi, {
  getWorkers,
  getWorkerById,
  getNearbyWorkers,
  updateSkills,
  updateAvailability,
  uploadCertificate,
  getCertificates,
  getWorkerStats,
  createBooking,
  getBookings,
  getBookingById,
  getBookingsByUser,
  updateBookingStatus,
  cancelBooking,
  getBookingHistory,
  getUpcomingBookings,
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  getUsers,
  getUserById,
  getCustomers,
  getCustomerById,
  getServices,
  getServiceById,
  getCategories,
  searchServices,
  getPopularServices,
  getSkills,
  createEmergencyRequest,
  getEmergencyStatus,
  cancelEmergency,
  getNearbyEmergencyWorkers,
  getMatchedWorkers,
  getRecommendations,
  submitRating,
  getRatings,
  getWorkerRatings,
  getBookingRating,
  createPayment,
  getPaymentById,
  getPaymentHistory,
  updatePaymentStatus,
  generateInvoice,
  getInvoiceById,
  getInvoices,
  downloadInvoice,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  updatePreferences,
  submitComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  addResponse,
  getDashboardStats,
  getBookingAnalytics,
  getWorkerAnalytics,
  getRevenueAnalytics,
  getServiceDemand,
  getWorkforceUtilization,
  getWelfarePrograms,
  getServiceDemandForecast,
  getWorkforceForecast,
  getPeakPeriods,
} from '../mock/mockApi.js';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:8000/api/v1';

// Default to mock API in development unless explicitly set to 'false'
const USE_MOCK_API =
  (typeof import.meta === 'undefined' || !import.meta.env)
    ? true
    : import.meta.env.VITE_USE_MOCK_API !== 'false';

/**
 * Retrieve auth token from browser storage.
 */
const getAuthToken = () => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('sevasangam_token');
  }
  return null;
};

/**
 * Build request headers with JSON content type and authorization token.
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
 * Handle HTTP response and unpack errors cleanly.
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unexpected error occurred',
    }));
    throw new Error(error.message || error.detail || `HTTP Error: ${response.status}`);
  }
  return response.json();
};

/**
 * Internal mock request router that dispatches REST calls to mockApi.js functions.
 */
const dispatchMockRequest = async (method, endpoint, payload = {}, params = {}) => {
  const rawPath = (endpoint || '').split('?')[0].replace(/\/$/, '') || '/';
  const queryParams = { ...params };

  // Parse any query params embedded in endpoint string
  if (endpoint && endpoint.includes('?')) {
    const searchPart = endpoint.split('?')[1];
    const searchParams = new URLSearchParams(searchPart);
    searchParams.forEach((val, key) => {
      if (queryParams[key] === undefined) queryParams[key] = val;
    });
  }

  // Combine queryParams with payload for convenience if GET
  const query = method === 'GET' ? { ...queryParams, ...payload } : queryParams;

  // --------------------------------------------------------------------------
  // GET Requests
  // --------------------------------------------------------------------------
  if (method === 'GET') {
    // Workers
    if (rawPath === '/workers/nearby') return mockApi.getNearbyWorkers(query);
    let match = rawPath.match(/^\/workers\/([^/]+)\/certificates$/);
    if (match) return mockApi.getCertificates(match[1]);
    match = rawPath.match(/^\/workers\/([^/]+)\/stats$/);
    if (match) return mockApi.getWorkerStats(match[1]);
    match = rawPath.match(/^\/workers\/([^/]+)$/);
    if (match) return mockApi.getWorkerById(match[1]);
    if (rawPath === '/workers') return mockApi.getWorkers(query);

    // Bookings
    if (rawPath === '/bookings/upcoming') return mockApi.getUpcomingBookings(query);
    if (rawPath === '/bookings/history') return mockApi.getBookingHistory(query);
    match = rawPath.match(/^\/bookings\/user\/([^/]+)$/);
    if (match) return mockApi.getBookingsByUser(match[1]);
    match = rawPath.match(/^\/bookings\/([^/]+)$/);
    if (match) return mockApi.getBookingById(match[1]);
    if (rawPath === '/bookings') return mockApi.getBookings(query);

    // Services & Skills
    if (rawPath === '/services/categories') return mockApi.getCategories();
    if (rawPath === '/services/search') return mockApi.searchServices(query?.q || query?.query || '');
    if (rawPath === '/services/popular') return mockApi.getPopularServices();
    match = rawPath.match(/^\/services\/([^/]+)$/);
    if (match) return mockApi.getServiceById(match[1]);
    if (rawPath === '/services') return mockApi.getServices(query);
    if (rawPath === '/skills') return mockApi.getSkills();

    // Emergency
    if (rawPath === '/emergency/workers') return mockApi.getNearbyEmergencyWorkers(query);
    match = rawPath.match(/^\/emergency\/([^/]+)$/);
    if (match) return mockApi.getEmergencyStatus(match[1]);

    // Matching
    if (rawPath === '/matching/recommendations') {
      return mockApi.getRecommendations(query?.serviceId, query);
    }

    // Ratings
    match = rawPath.match(/^\/ratings\/worker\/([^/]+)$/);
    if (match) return mockApi.getWorkerRatings(match[1]);
    match = rawPath.match(/^\/ratings\/booking\/([^/]+)$/);
    if (match) return mockApi.getBookingRating(match[1]);
    if (rawPath === '/ratings') return mockApi.getRatings(query);

    // Payments & Invoices
    if (rawPath === '/payments/history') return mockApi.getPaymentHistory(query);
    match = rawPath.match(/^\/payments\/([^/]+)$/);
    if (match) return mockApi.getPaymentById(match[1]);
    match = rawPath.match(/^\/invoices\/([^/]+)\/download$/);
    if (match) return mockApi.downloadInvoice(match[1]);
    match = rawPath.match(/^\/invoices\/([^/]+)$/);
    if (match) return mockApi.getInvoiceById(match[1]);
    if (rawPath === '/invoices') return mockApi.getInvoices(query);

    // Notifications
    if (rawPath === '/notifications/unread-count') return mockApi.getUnreadCount(query?.userId);
    if (rawPath === '/notifications') return mockApi.getNotifications(query);

    // Complaints
    match = rawPath.match(/^\/complaints\/([^/]+)$/);
    if (match) return mockApi.getComplaintById(match[1]);
    if (rawPath === '/complaints') return mockApi.getComplaints(query);

    // Analytics & Forecast & Welfare
    if (rawPath === '/analytics/dashboard') return mockApi.getDashboardStats();
    if (rawPath === '/analytics/bookings') return mockApi.getBookingAnalytics(query);
    if (rawPath === '/analytics/workers') return mockApi.getWorkerAnalytics(query);
    if (rawPath === '/analytics/revenue') return mockApi.getRevenueAnalytics(query);
    if (rawPath === '/analytics/demand') return mockApi.getServiceDemand(query);
    if (rawPath === '/analytics/utilization') return mockApi.getWorkforceUtilization();
    if (rawPath === '/forecast/demand') return mockApi.getServiceDemandForecast(query);
    if (rawPath === '/forecast/workforce') return mockApi.getWorkforceForecast(query);
    if (rawPath === '/forecast/peak-periods') return mockApi.getPeakPeriods(query);
    if (rawPath === '/welfare') return mockApi.getWelfarePrograms();

    // Users & Customers
    if (rawPath === '/users/profile') return mockApi.getProfile();
    match = rawPath.match(/^\/users\/([^/]+)$/);
    if (match) return mockApi.getUserById(match[1]);
    if (rawPath === '/users') return mockApi.getUsers(query);
    match = rawPath.match(/^\/customers\/([^/]+)$/);
    if (match) return mockApi.getCustomerById(match[1]);
    if (rawPath === '/customers') return mockApi.getCustomers(query);
  }

  // --------------------------------------------------------------------------
  // POST Requests
  // --------------------------------------------------------------------------
  if (method === 'POST') {
    // Bookings
    let match = rawPath.match(/^\/bookings\/([^/]+)\/cancel$/);
    if (match) return mockApi.cancelBooking(match[1], payload?.reason);
    if (rawPath === '/bookings') return mockApi.createBooking(payload);

    // Auth
    if (rawPath === '/auth/login') return mockApi.login(payload);
    if (rawPath === '/auth/register') return mockApi.register(payload);
    if (rawPath === '/auth/logout') return mockApi.logout();
    if (rawPath === '/auth/refresh') return mockApi.refreshToken();
    if (rawPath === '/auth/forgot-password') return mockApi.forgotPassword(payload?.email);
    if (rawPath === '/auth/reset-password') return mockApi.resetPassword(payload);
    if (rawPath === '/auth/verify-email') return mockApi.verifyEmail(payload?.token);

    // Users
    if (rawPath === '/users/change-password') return mockApi.changePassword(payload);

    // Emergency
    match = rawPath.match(/^\/emergency\/([^/]+)\/cancel$/);
    if (match) return mockApi.cancelEmergency(match[1]);
    if (rawPath === '/emergency') return mockApi.createEmergencyRequest(payload);

    // Matching
    if (rawPath === '/matching/workers') return mockApi.getMatchedWorkers(payload);

    // Ratings
    if (rawPath === '/ratings') return mockApi.submitRating(payload);

    // Payments & Invoices
    if (rawPath === '/payments') return mockApi.createPayment(payload);
    match = rawPath.match(/^\/invoices\/generate\/([^/]+)$/);
    if (match) return mockApi.generateInvoice(match[1]);

    // Notifications
    if (rawPath === '/notifications/read-all') return mockApi.markAllAsRead();

    // Complaints
    match = rawPath.match(/^\/complaints\/([^/]+)\/response$/);
    if (match) return mockApi.addResponse(match[1], payload);
    if (rawPath === '/complaints') return mockApi.submitComplaint(payload);
  }

  // --------------------------------------------------------------------------
  // PUT Requests
  // --------------------------------------------------------------------------
  if (method === 'PUT') {
    if (rawPath === '/workers/skills') return mockApi.updateSkills(payload);
    if (rawPath === '/workers/availability') return mockApi.updateAvailability(payload);
    if (rawPath === '/users/profile') return mockApi.updateProfile(payload);
    if (rawPath === '/notifications/preferences') return mockApi.updatePreferences(payload);
  }

  // --------------------------------------------------------------------------
  // PATCH Requests
  // --------------------------------------------------------------------------
  if (method === 'PATCH') {
    let match = rawPath.match(/^\/bookings\/([^/]+)\/status$/);
    if (match) return mockApi.updateBookingStatus(match[1], payload?.status);
    match = rawPath.match(/^\/payments\/([^/]+)$/);
    if (match) return mockApi.updatePaymentStatus(match[1], payload?.status);
    match = rawPath.match(/^\/notifications\/([^/]+)\/read$/);
    if (match) return mockApi.markAsRead(match[1]);
    match = rawPath.match(/^\/complaints\/([^/]+)$/);
    if (match) return mockApi.updateComplaintStatus(match[1], payload);
  }

  // --------------------------------------------------------------------------
  // DELETE Requests
  // --------------------------------------------------------------------------
  if (method === 'DELETE') {
    let match = rawPath.match(/^\/bookings\/([^/]+)$/);
    if (match) return mockApi.cancelBooking(match[1], 'Deleted by user');
    return mockApi.respond({ message: 'Deleted successfully' });
  }

  // --------------------------------------------------------------------------
  // UPLOAD Requests
  // --------------------------------------------------------------------------
  if (method === 'UPLOAD') {
    if (rawPath === '/workers/certificates') return mockApi.uploadCertificate(payload);
    if (rawPath === '/users/avatar') return mockApi.uploadAvatar(payload);
  }

  // Fallback for unmapped endpoints in mock mode
  console.warn(`[mockApi] Unmapped mock endpoint: ${method} ${endpoint}`, payload);
  return mockApi.respond({ message: `Simulated mock response for ${method} ${endpoint}`, payload });
};

/**
 * Core API Client Object.
 * Exposes standard HTTP methods (get, post, put, patch, delete, upload)
 * which seamlessly switch between mockApi and real FastAPI fetch() calls.
 */
const apiClient = {
  /**
   * GET request
   * @param {string} endpoint - API path (e.g. '/workers')
   * @param {Object} [params={}] - Query parameters
   */
  get: async (endpoint, params = {}) => {
    if (USE_MOCK_API) {
      return dispatchMockRequest('GET', endpoint, {}, params);
    }

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
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
   * @param {string} endpoint - API path
   * @param {Object} [data={}] - Request body
   */
  post: async (endpoint, data = {}) => {
    if (USE_MOCK_API) {
      return dispatchMockRequest('POST', endpoint, data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  /**
   * PUT request
   * @param {string} endpoint - API path
   * @param {Object} [data={}] - Request body
   */
  put: async (endpoint, data = {}) => {
    if (USE_MOCK_API) {
      return dispatchMockRequest('PUT', endpoint, data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  /**
   * PATCH request
   * @param {string} endpoint - API path
   * @param {Object} [data={}] - Request body
   */
  patch: async (endpoint, data = {}) => {
    if (USE_MOCK_API) {
      return dispatchMockRequest('PATCH', endpoint, data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  /**
   * DELETE request
   * @param {string} endpoint - API path
   */
  delete: async (endpoint) => {
    if (USE_MOCK_API) {
      return dispatchMockRequest('DELETE', endpoint);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });

    return handleResponse(response);
  },

  /**
   * Upload file (multipart/form-data)
   * @param {string} endpoint - API path
   * @param {FormData|Object} formData - Form data or file payload
   */
  upload: async (endpoint, formData) => {
    if (USE_MOCK_API) {
      return dispatchMockRequest('UPLOAD', endpoint, formData);
    }

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

  // ==========================================================================
  // Direct Function Wrappers
  // ==========================================================================
  getWorkers,
  getWorkerById,
  getNearbyWorkers,
  updateSkills,
  updateAvailability,
  uploadCertificate,
  getCertificates,
  getWorkerStats,
  createBooking,
  getBookings,
  getBookingById,
  getBookingsByUser,
  updateBookingStatus,
  cancelBooking,
  getBookingHistory,
  getUpcomingBookings,
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  getUsers,
  getUserById,
  getCustomers,
  getCustomerById,
  getServices,
  getServiceById,
  getCategories,
  searchServices,
  getPopularServices,
  getSkills,
  createEmergencyRequest,
  getEmergencyStatus,
  cancelEmergency,
  getNearbyEmergencyWorkers,
  getMatchedWorkers,
  getRecommendations,
  submitRating,
  getRatings,
  getWorkerRatings,
  getBookingRating,
  createPayment,
  getPaymentById,
  getPaymentHistory,
  updatePaymentStatus,
  generateInvoice,
  getInvoiceById,
  getInvoices,
  downloadInvoice,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  updatePreferences,
  submitComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  addResponse,
  getDashboardStats,
  getBookingAnalytics,
  getWorkerAnalytics,
  getRevenueAnalytics,
  getServiceDemand,
  getWorkforceUtilization,
  getWelfarePrograms,
  getServiceDemandForecast,
  getWorkforceForecast,
  getPeakPeriods,
};

export default apiClient;

// Named exports for configuration and direct helper access
export {
  API_BASE_URL,
  USE_MOCK_API,
  mockApi,
  getWorkers,
  getWorkerById,
  getNearbyWorkers,
  updateSkills,
  updateAvailability,
  uploadCertificate,
  getCertificates,
  getWorkerStats,
  createBooking,
  getBookings,
  getBookingById,
  getBookingsByUser,
  updateBookingStatus,
  cancelBooking,
  getBookingHistory,
  getUpcomingBookings,
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  getUsers,
  getUserById,
  getCustomers,
  getCustomerById,
  getServices,
  getServiceById,
  getCategories,
  searchServices,
  getPopularServices,
  getSkills,
  createEmergencyRequest,
  getEmergencyStatus,
  cancelEmergency,
  getNearbyEmergencyWorkers,
  getMatchedWorkers,
  getRecommendations,
  submitRating,
  getRatings,
  getWorkerRatings,
  getBookingRating,
  createPayment,
  getPaymentById,
  getPaymentHistory,
  updatePaymentStatus,
  generateInvoice,
  getInvoiceById,
  getInvoices,
  downloadInvoice,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  updatePreferences,
  submitComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  addResponse,
  getDashboardStats,
  getBookingAnalytics,
  getWorkerAnalytics,
  getRevenueAnalytics,
  getServiceDemand,
  getWorkforceUtilization,
  getWelfarePrograms,
  getServiceDemandForecast,
  getWorkforceForecast,
  getPeakPeriods,
};
