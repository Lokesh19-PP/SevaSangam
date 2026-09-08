/**
 * Formatters — SevaSangam
 * Data formatting helpers for currency, dates, and phone numbers.
 */

/**
 * Format number into Indian Rupee (INR) string.
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format ISO date string to localized date time.
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  }).format(date);
};

/**
 * Format phone number with standard Indian representation.
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})?(\d{5})(\d{5})$/);
  if (match) {
    const intlCode = match[1] ? `+${match[1]} ` : '+91 ';
    return `${intlCode}${match[2]}-${match[3]}`;
  }
  return phone;
};
