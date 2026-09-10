/**
 * Forecast API Service — SevaSangam
 * Handles demand forecasting and predictions.
 */
import apiClient from '../apiClient.js';

export const getServiceDemandForecast = (params) => apiClient.get('/forecast/demand', params);
export const getWorkforceForecast = (params) => apiClient.get('/forecast/workforce', params);
export const getPeakPeriods = (params) => apiClient.get('/forecast/peak-periods', params);

const forecastApi = {
  getServiceDemandForecast,
  getWorkforceForecast,
  getPeakPeriods,
};

export default forecastApi;
