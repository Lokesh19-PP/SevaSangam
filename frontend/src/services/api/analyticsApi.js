/**
 * Analytics API Service — SevaSangam
 * Handles analytics data for admin dashboard.
 */
import apiClient from '../apiClient.js';

export const getDashboardStats = () => apiClient.get('/analytics/dashboard');
export const getBookingAnalytics = (params) => apiClient.get('/analytics/bookings', params);
export const getWorkerAnalytics = (params) => apiClient.get('/analytics/workers', params);
export const getRevenueAnalytics = (params) => apiClient.get('/analytics/revenue', params);
export const getServiceDemand = (params) => apiClient.get('/analytics/demand', params);
export const getWorkforceUtilization = () => apiClient.get('/analytics/utilization');

const analyticsApi = {
  getDashboardStats,
  getBookingAnalytics,
  getWorkerAnalytics,
  getRevenueAnalytics,
  getServiceDemand,
  getWorkforceUtilization,
};

export default analyticsApi;
