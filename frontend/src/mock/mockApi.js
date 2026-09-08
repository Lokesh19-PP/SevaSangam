/**
 * Mock API — SevaSangam
 * 
 * Intercepts API calls during development when VITE_USE_MOCK_API=true.
 * Returns mock data to simulate backend responses.
 * 
 * Architecture:
 *   Component → Hook → API Service → apiClient → mockApi (dev)
 *   Component → Hook → API Service → apiClient → FastAPI  (prod)
 */

import { users } from './data/users';
import { customers } from './data/customers';
import { workers } from './data/workers';
import { services } from './data/services';
import { skills } from './data/skills';
import { certifications } from './data/certifications';
import { bookings } from './data/bookings';
import { ratings } from './data/ratings';
import { payments } from './data/payments';
import { invoices } from './data/invoices';
import { notifications } from './data/notifications';
import { complaints } from './data/complaints';
import { welfare } from './data/welfare';
import { analytics } from './data/analytics';

/**
 * Simulate network delay.
 */
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Wrap data in a simulated API response.
 */
const respond = async (data, delayMs = 300) => {
  await delay(delayMs);
  return { success: true, data };
};

/**
 * Mock API handlers.
 * These will be expanded in later phases as features are built.
 */
const mockApi = {
  // Users
  getUsers: () => respond(users),
  getUserById: (id) => respond(users.find((u) => u.id === id)),

  // Customers
  getCustomers: () => respond(customers),

  // Workers
  getWorkers: () => respond(workers),
  getWorkerById: (id) => respond(workers.find((w) => w.id === id)),

  // Services
  getServices: () => respond(services),
  getServiceById: (id) => respond(services.find((s) => s.id === id)),

  // Skills
  getSkills: () => respond(skills),

  // Certifications
  getCertifications: () => respond(certifications),

  // Bookings
  getBookings: () => respond(bookings),
  getBookingById: (id) => respond(bookings.find((b) => b.id === id)),

  // Ratings
  getRatings: () => respond(ratings),

  // Payments
  getPayments: () => respond(payments),

  // Invoices
  getInvoices: () => respond(invoices),

  // Notifications
  getNotifications: () => respond(notifications),

  // Complaints
  getComplaints: () => respond(complaints),

  // Welfare
  getWelfarePrograms: () => respond(welfare),

  // Analytics
  getAnalytics: () => respond(analytics),
};

export default mockApi;
