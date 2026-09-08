/**
 * Validators — SevaSangam
 * Input validation helpers.
 */

/**
 * Validate standard email format.
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validate 10-digit Indian mobile number.
 */
export const isValidIndianPhone = (phone) => {
  const cleaned = String(phone).replace(/\D/g, '');
  return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'));
};
