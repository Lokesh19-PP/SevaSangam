/**
 * Forecast API Service — SevaSangam
 * Handles demand forecasting and predictions.
 */
import apiClient from '../apiClient';

const forecastApi = {
  getServiceDemandForecast: (params) => apiClient.get('/forecast/demand', params),
  getWorkforceForecast: (params) => apiClient.get('/forecast/workforce', params),
  getPeakPeriods: (params) => apiClient.get('/forecast/peak-periods', params),
};

export default forecastApi;
