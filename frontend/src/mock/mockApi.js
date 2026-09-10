/**
 * Mock API — SevaSangam
 * 
 * Simulates backend API calls during development with artificial network delay.
 * Reads initial data from Janhvi's mock data files and maintains mutable in-memory
 * state for realistic create/read/update/delete operations.
 * 
 * Architecture:
 *   Component → Hook → API Service → apiClient → mockApi (dev / offline)
 *   Component → Hook → API Service → apiClient → FastAPI (production)
 */

import { users } from './data/users.js';
import { customers } from './data/customers.js';
import { workers } from './data/workers.js';
import { services } from './data/services.js';
import { skills } from './data/skills.js';
import { certifications } from './data/certifications.js';
import { bookings } from './data/bookings.js';
import { ratings } from './data/ratings.js';
import { payments } from './data/payments.js';
import { invoices } from './data/invoices.js';
import { notifications } from './data/notifications.js';
import { complaints } from './data/complaints.js';
import { welfare } from './data/welfare.js';
import { analytics } from './data/analytics.js';

// ============================================================================
// In-Memory Mutable State Clones
// ============================================================================
let mockWorkers = workers.map((w) => ({ ...w, skills: [...(w.skills || [])] }));
let mockBookings = bookings.map((b) => ({ ...b }));
let mockUsers = users.map((u) => ({ ...u }));
let mockCustomers = customers.map((c) => ({ ...c }));
let mockServices = services.map((s) => ({ ...s }));
let mockSkills = skills.map((sk) => ({ ...sk }));
let mockCertifications = certifications.map((c) => ({ ...c }));
let mockRatings = ratings.map((r) => ({ ...r }));
let mockPayments = payments.map((p) => ({ ...p }));
let mockInvoices = invoices.map((i) => ({ ...i }));
let mockNotifications = notifications.map((n) => ({ ...n }));
let mockComplaints = complaints.map((cp) => ({ ...cp }));
let mockWelfare = welfare.map((w) => ({ ...w }));
let mockAnalytics = JSON.parse(JSON.stringify(analytics));

/**
 * Simulate network delay.
 * @param {number} ms - Milliseconds to delay (defaults to 250ms).
 */
export const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Wrap data in standard SevaSangam API response shape.
 */
export const respond = async (data, delayMs = 250) => {
  await delay(delayMs);
  return { success: true, data };
};

// ============================================================================
// Workers API
// ============================================================================

/**
 * Get workers list with filtering and search support.
 * @param {Object} [filters={}] - Optional search/filter parameters.
 */
export async function getWorkers(filters = {}) {
  let result = [...mockWorkers];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        (w.primarySkill && w.primarySkill.toLowerCase().includes(q)) ||
        (w.bio && w.bio.toLowerCase().includes(q)) ||
        (w.location?.area && w.location.area.toLowerCase().includes(q)) ||
        w.skills.some((s) => s.toLowerCase().includes(q))
    );
  }

  if (filters.skill) {
    const skillQuery = filters.skill.toLowerCase();
    result = result.filter(
      (w) =>
        (w.primarySkill && w.primarySkill.toLowerCase() === skillQuery) ||
        w.skills.some((s) => s.toLowerCase() === skillQuery)
    );
  }

  if (filters.category) {
    const catQuery = filters.category.toLowerCase();
    result = result.filter(
      (w) => w.primarySkill && w.primarySkill.toLowerCase().includes(catQuery)
    );
  }

  if (filters.availability) {
    result = result.filter((w) => w.availability === filters.availability);
  }

  if (filters.emergencyAvailable !== undefined) {
    const isEmerg = filters.emergencyAvailable === true || filters.emergencyAvailable === 'true';
    result = result.filter((w) => Boolean(w.emergencyAvailable) === isEmerg);
  }

  if (filters.cooperativeId) {
    result = result.filter((w) => w.cooperativeId === filters.cooperativeId);
  }

  if (filters.minRating) {
    const minRating = Number(filters.minRating);
    result = result.filter((w) => (w.rating || 0) >= minRating);
  }

  if (filters.maxRate) {
    const maxRate = Number(filters.maxRate);
    result = result.filter((w) => (w.hourlyRate || 0) <= maxRate);
  }

  return respond(result);
}

/**
 * Get single worker by ID (or associated userId).
 * @param {string} id - Worker ID or User ID.
 */
export async function getWorkerById(id) {
  const worker = mockWorkers.find((w) => w.id === id || w.userId === id);
  return respond(worker || null);
}

/**
 * Get nearby workers sorted by geographic proximity.
 * @param {Object} [params={}] - Location and filter options.
 */
export async function getNearbyWorkers(params = {}) {
  let result = [...mockWorkers].sort((a, b) => (a.distanceKm || 99) - (b.distanceKm || 99));

  if (params.skill) {
    const sq = params.skill.toLowerCase();
    result = result.filter(
      (w) =>
        (w.primarySkill && w.primarySkill.toLowerCase() === sq) ||
        w.skills.some((s) => s.toLowerCase() === sq)
    );
  }

  if (params.maxDistanceKm) {
    const maxDist = Number(params.maxDistanceKm);
    result = result.filter((w) => (w.distanceKm || 0) <= maxDist);
  }

  return respond(result);
}

/**
 * Update worker skills.
 * @param {Object} data - Skills payload ({ workerId, skills, primarySkill }).
 */
export async function updateSkills(data = {}) {
  const worker = mockWorkers.find((w) => w.id === data.workerId || w.userId === data.workerId);
  if (worker) {
    if (Array.isArray(data.skills)) worker.skills = [...data.skills];
    if (data.primarySkill) worker.primarySkill = data.primarySkill;
    return respond(worker);
  }
  return respond(data);
}

/**
 * Update worker availability status.
 * @param {Object} data - Availability payload ({ workerId, availability, emergencyAvailable }).
 */
export async function updateAvailability(data = {}) {
  const worker = mockWorkers.find((w) => w.id === data.workerId || w.userId === data.workerId);
  if (worker) {
    if (data.availability) worker.availability = data.availability;
    if (data.emergencyAvailable !== undefined) {
      worker.emergencyAvailable = Boolean(data.emergencyAvailable);
    }
    return respond(worker);
  }
  return respond(data);
}

/**
 * Upload worker certification document.
 * @param {FormData|Object} data - Certificate metadata or form data.
 */
export async function uploadCertificate(data) {
  const newCert = {
    id: `cert_${String(mockCertifications.length + 1).padStart(3, '0')}`,
    workerId: data?.workerId || 'wrk_001',
    workerName: data?.workerName || 'Priya Deshmukh',
    name: data?.name || 'Vocational Skill Certification',
    certificateNumber: data?.certificateNumber || `SKILL-CERT-${Date.now().toString().slice(-6)}`,
    issuedBy: data?.issuedBy || 'National Skill Development Corporation',
    issuedDate: new Date().toISOString().slice(0, 10),
    expiryDate: null,
    status: 'pending',
    verificationMethod: 'OCR_AUTO + ADMIN_CHECK',
    documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    verifiedAt: null,
  };
  mockCertifications.push(newCert);
  return respond(newCert);
}

/**
 * Get certificates for a worker.
 * @param {string} [workerId] - Worker ID.
 */
export async function getCertificates(workerId) {
  if (workerId) {
    return respond(mockCertifications.filter((c) => c.workerId === workerId));
  }
  return respond(mockCertifications);
}

/**
 * Get computed statistics for a worker.
 * @param {string} workerId - Worker ID.
 */
export async function getWorkerStats(workerId) {
  const worker = mockWorkers.find((w) => w.id === workerId || w.userId === workerId);
  const workerBookings = mockBookings.filter((b) => b.workerId === (worker?.id || workerId));
  const completed = workerBookings.filter((b) => b.status === 'completed');
  const active = workerBookings.filter(
    (b) => b.status === 'in_progress' || b.status === 'upcoming' || b.status === 'pending'
  );
  const totalEarnings = completed.reduce((acc, b) => acc + (b.amount || 0) * 0.85, 0);

  const stats = {
    workerId: worker?.id || workerId,
    totalJobs: worker?.totalJobs || workerBookings.length,
    completedJobs: completed.length,
    activeJobs: active.length,
    totalEarnings: Math.round(totalEarnings),
    rating: worker?.rating || 4.8,
    reviewCount: worker?.reviewCount || 40,
    currentWorkload: worker?.currentWorkload || active.length,
    cooperativeFairScore: 94,
    insuranceStatus: 'Active (PMSBY)',
  };

  return respond(stats);
}

// ============================================================================
// Bookings API
// ============================================================================

/**
 * Create a new booking.
 * @param {Object} data - Booking creation details.
 */
export async function createBooking(data = {}) {
  const nextNum = mockBookings.length + 1;
  const newBooking = {
    id: `bkg_${String(nextNum).padStart(3, '0')}`,
    bookingNumber: `SS-BKG-2025-${String(nextNum + 100).padStart(4, '0')}`,
    customerId: data.customerId || 'cust_001',
    customerName: data.customerName || 'Customer User',
    customerPhone: data.customerPhone || '+91 98230 12345',
    workerId: data.workerId || 'wrk_001',
    workerName: data.workerName || 'Priya Deshmukh',
    serviceId: data.serviceId || 'svc_001',
    serviceName: data.serviceName || 'Plumbing & Water Systems',
    status: data.status || 'upcoming',
    isEmergency: Boolean(data.isEmergency),
    scheduledDate: data.scheduledDate || new Date(Date.now() + 86400000).toISOString(),
    completedDate: null,
    address: data.address || 'Pune, Maharashtra',
    location: data.location || { lat: 18.5204, lng: 73.8567 },
    amount: Number(data.amount) || 500,
    paymentStatus: data.paymentStatus || 'pending',
    notes: data.notes || '',
    ratingSubmitted: false,
    createdAt: new Date().toISOString(),
  };

  mockBookings.unshift(newBooking);
  return respond(newBooking);
}

/**
 * Get bookings with optional filters.
 * @param {Object} [filters={}] - Filter parameters (status, customerId, workerId, isEmergency).
 */
export async function getBookings(filters = {}) {
  let result = [...mockBookings];

  if (filters.customerId) {
    result = result.filter((b) => b.customerId === filters.customerId);
  }

  if (filters.workerId) {
    result = result.filter((b) => b.workerId === filters.workerId);
  }

  if (filters.status) {
    result = result.filter((b) => b.status === filters.status);
  }

  if (filters.isEmergency !== undefined) {
    const isEmerg = filters.isEmergency === true || filters.isEmergency === 'true';
    result = result.filter((b) => Boolean(b.isEmergency) === isEmerg);
  }

  return respond(result);
}

/**
 * Get booking by ID.
 * @param {string} id - Booking ID or bookingNumber.
 */
export async function getBookingById(id) {
  const booking = mockBookings.find((b) => b.id === id || b.bookingNumber === id);
  return respond(booking || null);
}

/**
 * Get bookings for a specific user (either customer ID or worker ID).
 * @param {string} id - User, customer, or worker ID.
 */
export async function getBookingsByUser(id) {
  const result = mockBookings.filter(
    (b) => b.customerId === id || b.workerId === id || b.userId === id
  );
  return respond(result);
}

/**
 * Update booking status (e.g. pending -> in_progress -> completed | cancelled).
 * @param {string} id - Booking ID.
 * @param {string} status - New status.
 */
export async function updateBookingStatus(id, status) {
  const booking = mockBookings.find((b) => b.id === id);
  if (booking) {
    booking.status = status;
    if (status === 'completed' && !booking.completedDate) {
      booking.completedDate = new Date().toISOString();
      booking.paymentStatus = 'paid';
    }
    return respond(booking);
  }
  return respond({ id, status });
}

/**
 * Cancel a booking with reason.
 * @param {string} id - Booking ID.
 * @param {string} [reason] - Reason for cancellation.
 */
export async function cancelBooking(id, reason = '') {
  const booking = mockBookings.find((b) => b.id === id);
  if (booking) {
    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date().toISOString();
    return respond(booking);
  }
  return respond({ id, status: 'cancelled', reason });
}

/**
 * Get completed / cancelled booking history.
 * @param {Object} [params={}] - Filter parameters.
 */
export async function getBookingHistory(params = {}) {
  let result = mockBookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');
  if (params.workerId) result = result.filter((b) => b.workerId === params.workerId);
  if (params.customerId) result = result.filter((b) => b.customerId === params.customerId);
  return respond(result);
}

/**
 * Get upcoming / pending bookings.
 * @param {Object} [params={}] - Filter parameters.
 */
export async function getUpcomingBookings(params = {}) {
  let result = mockBookings.filter(
    (b) => b.status === 'upcoming' || b.status === 'in_progress' || b.status === 'pending'
  );
  if (params.workerId) result = result.filter((b) => b.workerId === params.workerId);
  if (params.customerId) result = result.filter((b) => b.customerId === params.customerId);
  return respond(result);
}

// ============================================================================
// Auth API
// ============================================================================

export async function login(credentials = {}) {
  const user =
    mockUsers.find((u) => u.email === credentials.email || u.phone === credentials.phone) ||
    mockUsers[0];
  const token = `sevasangam_mock_jwt_${user.id}_${Date.now()}`;
  return respond({ user, token, role: user.role });
}

export async function register(userData = {}) {
  const newUser = {
    id: `usr_${String(mockUsers.length + 1).padStart(3, '0')}`,
    name: userData.name || 'New User',
    email: userData.email || 'user@example.com',
    phone: userData.phone || '+91 99999 00000',
    role: userData.role || 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    language: userData.language || 'en',
    city: userData.city || 'Pune',
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  const token = `sevasangam_mock_jwt_${newUser.id}_${Date.now()}`;
  return respond({ user: newUser, token, role: newUser.role });
}

export async function logout() {
  return respond({ message: 'Logged out successfully' });
}

export async function refreshToken() {
  return respond({ token: `sevasangam_refreshed_jwt_${Date.now()}` });
}

export async function forgotPassword(email) {
  return respond({ message: `Password reset instructions sent to ${email || 'email'}` });
}

export async function resetPassword(data) {
  return respond({ message: 'Password updated successfully' });
}

export async function verifyEmail(token) {
  return respond({ message: 'Email verified successfully' });
}

// ============================================================================
// Users & Customers API
// ============================================================================

export async function getProfile() {
  return respond(mockUsers[0]);
}

export async function updateProfile(data = {}) {
  const user = mockUsers[0];
  Object.assign(user, data);
  return respond(user);
}

export async function changePassword(data) {
  return respond({ message: 'Password changed successfully' });
}

export async function uploadAvatar(formData) {
  return respond({
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  });
}

export async function getUsers(params = {}) {
  let result = [...mockUsers];
  if (params.role) result = result.filter((u) => u.role === params.role);
  return respond(result);
}

export async function getUserById(id) {
  const user = mockUsers.find((u) => u.id === id);
  return respond(user || null);
}

export async function getCustomers(params = {}) {
  return respond(mockCustomers);
}

export async function getCustomerById(id) {
  const customer = mockCustomers.find((c) => c.id === id || c.userId === id);
  return respond(customer || null);
}

// ============================================================================
// Services & Skills API
// ============================================================================

export async function getServices(params = {}) {
  let result = [...mockServices];
  if (params.category) {
    result = result.filter((s) => s.category.toLowerCase() === params.category.toLowerCase());
  }
  if (params.popular !== undefined) {
    const isPop = params.popular === true || params.popular === 'true';
    result = result.filter((s) => Boolean(s.popular) === isPop);
  }
  if (params.emergencySupported !== undefined) {
    const isEmerg = params.emergencySupported === true || params.emergencySupported === 'true';
    result = result.filter((s) => Boolean(s.emergencySupported) === isEmerg);
  }
  return respond(result);
}

export async function getServiceById(id) {
  const service = mockServices.find((s) => s.id === id || s.slug === id);
  return respond(service || null);
}

export async function getCategories() {
  const categories = [...new Set(mockServices.map((s) => s.category))];
  return respond(categories);
}

export async function searchServices(query = '') {
  const q = (query || '').toLowerCase();
  const result = mockServices.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
  );
  return respond(result);
}

export async function getPopularServices() {
  return respond(mockServices.filter((s) => s.popular));
}

export async function getSkills() {
  return respond(mockSkills);
}

// ============================================================================
// Emergency API
// ============================================================================

export async function createEmergencyRequest(data = {}) {
  const availableWorker =
    mockWorkers.find(
      (w) => w.emergencyAvailable && w.availability === 'available' && w.primarySkill === 'Plumbing'
    ) || mockWorkers[0];

  const emergencyBooking = {
    id: `bkg_emg_${Date.now().toString().slice(-4)}`,
    bookingNumber: `SS-EMG-2025-${Date.now().toString().slice(-4)}`,
    customerId: data.customerId || 'cust_003',
    customerName: data.customerName || 'Vikram Joshi',
    customerPhone: data.customerPhone || '+91 98236 78901',
    workerId: availableWorker.id,
    workerName: availableWorker.name,
    serviceId: data.serviceId || 'svc_001',
    serviceName: data.serviceName || 'Emergency Plumbing Repair',
    status: 'in_progress',
    isEmergency: true,
    scheduledDate: new Date().toISOString(),
    completedDate: null,
    address: data.address || 'Yerawada, Pune 411006',
    location: data.location || { lat: 18.5529, lng: 73.8864 },
    amount: Number(data.amount) || 900,
    paymentStatus: 'pending',
    notes: data.notes || 'Emergency assistance requested via fast dispatch',
    ratingSubmitted: false,
    createdAt: new Date().toISOString(),
    etaMinutes: 18,
  };

  mockBookings.unshift(emergencyBooking);
  return respond(emergencyBooking);
}

export async function getEmergencyStatus(id) {
  const booking = mockBookings.find((b) => b.id === id);
  return respond({
    bookingId: id,
    status: booking?.status || 'in_progress',
    etaMinutes: 14,
    workerName: booking?.workerName || 'Assigned Worker',
    workerPhone: '+91 98231 23456',
  });
}

export async function cancelEmergency(id) {
  return cancelBooking(id, 'Cancelled by user');
}

export async function getNearbyEmergencyWorkers(params = {}) {
  const emergencyWorkers = mockWorkers.filter((w) => w.emergencyAvailable && w.availability === 'available');
  return respond(emergencyWorkers);
}

// ============================================================================
// Matching API (Cooperative Fair Workload + Proximity AI)
// ============================================================================

export async function getMatchedWorkers(params = {}) {
  // Fair matching balances skill, rating, proximity, and current workload
  const matched = [...mockWorkers]
    .map((w) => {
      const skillScore = params.skill && w.skills.includes(params.skill) ? 40 : 25;
      const distanceScore = Math.max(0, 30 - (w.distanceKm || 5) * 5);
      const ratingScore = ((w.rating || 4.5) / 5) * 20;
      const fairWorkloadScore = Math.max(0, 20 - (w.currentWorkload || 0) * 4); // higher if lower workload
      const matchPercentage = Math.round(skillScore + distanceScore + ratingScore + fairWorkloadScore);
      return { ...w, matchPercentage: Math.min(99, matchPercentage) };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return respond(matched);
}

export async function getRecommendations(serviceId, location = {}) {
  const candidates = [...mockWorkers].slice(0, 3);
  return respond(candidates);
}

// ============================================================================
// Ratings & Reviews API
// ============================================================================

export async function submitRating(data = {}) {
  const nextId = `rtg_${String(mockRatings.length + 1).padStart(3, '0')}`;
  const newRating = {
    id: nextId,
    bookingId: data.bookingId || `bkg_00${mockRatings.length + 1}`,
    customerId: data.customerId || 'cust_001',
    customerName: data.customerName || 'Rahul Sharma',
    workerId: data.workerId || 'wrk_001',
    workerName: data.workerName || 'Priya Deshmukh',
    score: Number(data.score) || 5,
    categoryScores: data.categoryScores || {
      punctuality: 5,
      skillQuality: 5,
      cleanliness: 5,
      politeness: 5,
    },
    review: data.review || 'Great cooperative service quality and fair pricing.',
    createdAt: new Date().toISOString(),
  };

  mockRatings.unshift(newRating);

  // Update worker's rating and review count
  const worker = mockWorkers.find((w) => w.id === newRating.workerId);
  if (worker) {
    const currentReviews = worker.reviewCount || 1;
    worker.rating = Number(
      (((worker.rating || 4.8) * currentReviews + newRating.score) / (currentReviews + 1)).toFixed(1)
    );
    worker.reviewCount = currentReviews + 1;
  }

  return respond(newRating);
}

export async function getRatings(params = {}) {
  let result = [...mockRatings];
  if (params.workerId) result = result.filter((r) => r.workerId === params.workerId);
  if (params.customerId) result = result.filter((r) => r.customerId === params.customerId);
  return respond(result);
}

export async function getWorkerRatings(workerId) {
  return respond(mockRatings.filter((r) => r.workerId === workerId));
}

export async function getBookingRating(bookingId) {
  const rating = mockRatings.find((r) => r.bookingId === bookingId);
  return respond(rating || null);
}

// ============================================================================
// Payments & Invoices API
// ============================================================================

export async function createPayment(data = {}) {
  const nextId = `pay_${String(mockPayments.length + 1).padStart(3, '0')}`;
  const amount = Number(data.amount) || 700;
  const newPayment = {
    id: nextId,
    bookingId: data.bookingId || 'bkg_001',
    transactionRef: `UPI-COOP-${Date.now().toString().slice(-6)}`,
    amount,
    workerProratedPayout: Math.round(amount * 0.85),
    cooperativeWelfareFee: Math.round(amount * 0.1),
    platformFee: Math.round(amount * 0.05),
    method: data.method || 'upi',
    status: data.status || 'paid',
    paidAt: new Date().toISOString(),
    receiptUrl: null,
  };
  mockPayments.unshift(newPayment);
  return respond(newPayment);
}

export async function getPaymentById(id) {
  const payment = mockPayments.find((p) => p.id === id || p.bookingId === id);
  return respond(payment || null);
}

export async function getPaymentHistory(params = {}) {
  return respond(mockPayments);
}

export async function updatePaymentStatus(id, status) {
  const payment = mockPayments.find((p) => p.id === id);
  if (payment) {
    payment.status = status;
    return respond(payment);
  }
  return respond({ id, status });
}

export async function generateInvoice(bookingId) {
  const booking = mockBookings.find((b) => b.id === bookingId) || mockBookings[0];
  const subtotal = booking.amount || 700;
  const cgst = Math.round(subtotal * 0.09);
  const sgst = Math.round(subtotal * 0.09);
  const total = subtotal + cgst + sgst;

  const nextId = `inv_${String(mockInvoices.length + 1).padStart(3, '0')}`;
  const newInvoice = {
    id: nextId,
    bookingId: booking.id,
    paymentId: `pay_${nextId.slice(-3)}`,
    invoiceNumber: `SS-PUN-2025-${String(mockInvoices.length + 150).padStart(4, '0')}`,
    customerName: booking.customerName,
    workerName: booking.workerName,
    serviceTitle: booking.serviceName,
    subtotal,
    cgst,
    sgst,
    total,
    status: 'paid',
    issuedDate: new Date().toISOString(),
    cooperativeGstin: '27AABCS1234F1Z8',
  };

  mockInvoices.unshift(newInvoice);
  return respond(newInvoice);
}

export async function getInvoiceById(id) {
  const invoice = mockInvoices.find((i) => i.id === id || i.bookingId === id);
  return respond(invoice || null);
}

export async function getInvoices(params = {}) {
  return respond(mockInvoices);
}

export async function downloadInvoice(id) {
  return respond({
    id,
    downloadUrl: `https://mock.sevasangam.in/invoices/${id}.pdf`,
    filename: `SevaSangam_Invoice_${id}.pdf`,
  });
}

// ============================================================================
// Notifications API
// ============================================================================

export async function getNotifications(params = {}) {
  let result = [...mockNotifications];
  if (params.userId) result = result.filter((n) => n.userId === params.userId);
  if (params.recipientRole) result = result.filter((n) => n.recipientRole === params.recipientRole);
  return respond(result);
}

export async function markAsRead(id) {
  const notif = mockNotifications.find((n) => n.id === id);
  if (notif) notif.isRead = true;
  return respond(notif || { id, isRead: true });
}

export async function markAllAsRead() {
  mockNotifications.forEach((n) => (n.isRead = true));
  return respond({ success: true, count: mockNotifications.length });
}

export async function getUnreadCount(userId) {
  const unread = mockNotifications.filter((n) => !n.isRead && (!userId || n.userId === userId));
  return respond({ count: unread.length });
}

export async function updatePreferences(data = {}) {
  return respond({ success: true, preferences: data });
}

// ============================================================================
// Complaints API
// ============================================================================

export async function submitComplaint(data = {}) {
  const nextId = `comp_${String(mockComplaints.length + 1).padStart(3, '0')}`;
  const newComp = {
    id: nextId,
    ticketNumber: `GRV-2025-${String(mockComplaints.length + 15).padStart(4, '0')}`,
    bookingId: data.bookingId || null,
    customerId: data.customerId || 'cust_001',
    customerName: data.customerName || 'Rahul Sharma',
    workerId: data.workerId || null,
    workerName: data.workerName || null,
    subject: data.subject || 'Service Inquiry',
    category: data.category || 'Quality',
    description: data.description || '',
    status: 'open',
    priority: data.priority || 'medium',
    createdAt: new Date().toISOString(),
    resolvedAt: null,
    resolutionNotes: null,
  };
  mockComplaints.unshift(newComp);
  return respond(newComp);
}

export async function getComplaints(params = {}) {
  let result = [...mockComplaints];
  if (params.status) result = result.filter((c) => c.status === params.status);
  if (params.customerId) result = result.filter((c) => c.customerId === params.customerId);
  return respond(result);
}

export async function getComplaintById(id) {
  const complaint = mockComplaints.find((c) => c.id === id || c.ticketNumber === id);
  return respond(complaint || null);
}

export async function updateComplaintStatus(id, data = {}) {
  const complaint = mockComplaints.find((c) => c.id === id);
  if (complaint) {
    if (data.status) complaint.status = data.status;
    if (data.resolutionNotes) complaint.resolutionNotes = data.resolutionNotes;
    if (data.status === 'resolved' && !complaint.resolvedAt) {
      complaint.resolvedAt = new Date().toISOString();
    }
    return respond(complaint);
  }
  return respond({ id, ...data });
}

export async function addResponse(id, response = {}) {
  const complaint = mockComplaints.find((c) => c.id === id);
  if (complaint) {
    complaint.resolutionNotes = response.message || response.notes || 'Admin reviewed';
    return respond(complaint);
  }
  return respond({ id, response });
}

// ============================================================================
// Analytics, Forecast & Welfare API
// ============================================================================

export async function getDashboardStats() {
  return respond(mockAnalytics.overview);
}

export async function getBookingAnalytics(params = {}) {
  return respond(mockAnalytics.monthlyBookings);
}

export async function getWorkerAnalytics(params = {}) {
  return respond(mockAnalytics.cooperativeFairDistributionSummary);
}

export async function getRevenueAnalytics(params = {}) {
  return respond({
    totalRevenueGross: mockAnalytics.overview.totalRevenueGross,
    workerPayoutTotal: mockAnalytics.overview.workerPayoutTotal,
    welfareFundTotal: mockAnalytics.overview.welfareFundTotal,
    monthlyBreakdown: mockAnalytics.monthlyBookings,
  });
}

export async function getServiceDemand(params = {}) {
  return respond(mockAnalytics.topServices);
}

export async function getWorkforceUtilization() {
  return respond(mockAnalytics.zoneWorkforceUtilization);
}

export async function getWelfarePrograms() {
  return respond(mockWelfare);
}

export async function getServiceDemandForecast(params = {}) {
  return respond([
    { service: 'Plumbing & Water Systems', currentDemand: 540, projectedNextMonth: 690, growthPercent: 28 },
    { service: 'Electrical Repair & Wiring', currentDemand: 490, projectedNextMonth: 600, growthPercent: 22 },
    { service: 'Home Deep Cleaning', currentDemand: 410, projectedNextMonth: 550, growthPercent: 34 },
    { service: 'Elderly Care & Patient Aide', currentDemand: 190, projectedNextMonth: 270, growthPercent: 42 },
  ]);
}

export async function getWorkforceForecast(params = {}) {
  return respond({
    projectedWorkersNeeded: 184,
    currentDeficit: 28,
    prioritySkills: ['Electrician (MSEB)', 'Certified Caregiver', 'Plumber'],
    recruitmentTargetZone: 'Kharadi / Wagholi & Hinjawadi',
  });
}

export async function getPeakPeriods(params = {}) {
  return respond([
    { dayOfWeek: 'Saturday', peakHours: '09:00 - 13:00', loadFactor: 1.45 },
    { dayOfWeek: 'Sunday', peakHours: '10:00 - 16:00', loadFactor: 1.6 },
    { dayOfWeek: 'Wednesday', peakHours: '17:00 - 20:00', loadFactor: 1.2 },
  ]);
}

// ============================================================================
// Default Export
// ============================================================================

const mockApi = {
  // Delay & response helpers
  delay,
  respond,

  // Workers
  getWorkers,
  getWorkerById,
  getNearbyWorkers,
  updateSkills,
  updateAvailability,
  uploadCertificate,
  getCertificates,
  getWorkerStats,

  // Bookings
  createBooking,
  getBookings,
  getBookingById,
  getBookingsByUser,
  updateBookingStatus,
  cancelBooking,
  getBookingHistory,
  getUpcomingBookings,

  // Auth
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,

  // Users & Customers
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  getUsers,
  getUserById,
  getCustomers,
  getCustomerById,

  // Services
  getServices,
  getServiceById,
  getCategories,
  searchServices,
  getPopularServices,
  getSkills,

  // Emergency
  createEmergencyRequest,
  getEmergencyStatus,
  cancelEmergency,
  getNearbyEmergencyWorkers,

  // Matching
  getMatchedWorkers,
  getRecommendations,

  // Ratings
  submitRating,
  getRatings,
  getWorkerRatings,
  getBookingRating,

  // Payments & Invoices
  createPayment,
  getPaymentById,
  getPaymentHistory,
  updatePaymentStatus,
  generateInvoice,
  getInvoiceById,
  getInvoices,
  downloadInvoice,

  // Notifications
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  updatePreferences,

  // Complaints
  submitComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  addResponse,

  // Analytics & Welfare
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

export default mockApi;
