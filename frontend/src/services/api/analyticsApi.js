/**
 * Analytics API Service — SevaSangam
 * Handles analytics data for admin dashboard.
 */
import apiClient from '../apiClient';

const analyticsApi = {
  getDashboardStats: () => apiClient.get('/analytics/dashboard'),
  getBookingAnalytics: (params) => apiClient.get('/analytics/bookings', params),
  getWorkerAnalytics: (params) => apiClient.get('/analytics/workers', params),
  getRevenueAnalytics: (params) => apiClient.get('/analytics/revenue', params),
  getServiceDemand: (params) => apiClient.get('/analytics/demand', params),
  getWorkforceUtilization: () => apiClient.get('/analytics/utilization'),
};

export default analyticsApi;
