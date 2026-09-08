/**
 * Constants — SevaSangam
 * Application-wide constant definitions.
 */

export const USER_ROLES = {
  CUSTOMER: 'customer',
  WORKER: 'worker',
  ADMIN: 'admin',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const SERVICE_CATEGORIES = [
  'Home Maintenance',
  'Home Improvement',
  'Housekeeping',
  'Appliance Repair',
  'Construction',
];
