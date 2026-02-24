// dateUtils.js - Date formatting utilities

/**
 * Format date to "Feb 23, 2026" format
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

/**
 * Convert date input value (YYYY-MM-DD) to ISO string
 */
export const dateInputToISO = (dateValue) => {
  if (!dateValue) return null;
  return new Date(dateValue).toISOString();
};

/**
 * Convert ISO date string to date input format (YYYY-MM-DD)
 */
export const isoToDateInput = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toISOString().split('T')[0];
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDateInput = () => {
  return new Date().toISOString().split('T')[0];
};