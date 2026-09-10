/**
 * API Services Barrel Export — SevaSangam
 * 
 * Re-exports all per-domain API services.
 * React components and hooks should call these services or custom hooks,
 * NEVER mock data or apiClient directly.
 */

export { default as authApi } from './authApi.js';
export * from './authApi.js';

export { default as userApi } from './userApi.js';
export * from './userApi.js';

export { default as workerApi } from './workerApi.js';
export * from './workerApi.js';

export { default as serviceApi } from './serviceApi.js';
export * from './serviceApi.js';

export { default as bookingApi } from './bookingApi.js';
export * from './bookingApi.js';

export { default as emergencyApi } from './emergencyApi.js';
export * from './emergencyApi.js';

export { default as matchingApi } from './matchingApi.js';
export * from './matchingApi.js';

export { default as ratingApi } from './ratingApi.js';
export * from './ratingApi.js';

export { default as paymentApi } from './paymentApi.js';
export * from './paymentApi.js';

export { default as invoiceApi } from './invoiceApi.js';
export * from './invoiceApi.js';

export { default as notificationApi } from './notificationApi.js';
export * from './notificationApi.js';

export { default as complaintApi } from './complaintApi.js';
export * from './complaintApi.js';

export { default as analyticsApi } from './analyticsApi.js';
export * from './analyticsApi.js';

export { default as forecastApi } from './forecastApi.js';
export * from './forecastApi.js';
