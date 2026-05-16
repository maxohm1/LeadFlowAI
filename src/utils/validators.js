/**
 * Input Validation Utilities
 * Validates and sanitizes lead form submissions
 */

/**
 * Validates an email address format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a URL format (optional field)
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
  if (!url) return true; // URL is optional
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitizes a string input — trims whitespace and removes HTML tags
 * @param {string} input
 * @returns {string}
 */
function sanitize(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/<[^>]*>/g, '');
}

/**
 * Normalizes a URL to ensure it has a protocol
 * @param {string} url
 * @returns {string}
 */
function normalizeUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Validates the complete lead submission data
 * @param {Object} data - The lead form data
 * @returns {{ valid: boolean, errors: string[], sanitized: Object }}
 */
function validateLeadData(data) {
  const errors = [];
  const sanitized = {};

  // Required: Full Name
  sanitized.fullName = sanitize(data.fullName);
  if (!sanitized.fullName || sanitized.fullName.length < 2) {
    errors.push('Full name is required (minimum 2 characters).');
  }

  // Required: Email
  sanitized.email = sanitize(data.email).toLowerCase();
  if (!sanitized.email) {
    errors.push('Email address is required.');
  } else if (!isValidEmail(sanitized.email)) {
    errors.push('Please provide a valid email address.');
  }

  // Required: Company Name
  sanitized.companyName = sanitize(data.companyName);
  if (!sanitized.companyName || sanitized.companyName.length < 2) {
    errors.push('Company name is required (minimum 2 characters).');
  }

  // Optional: Company Website
  const rawUrl = sanitize(data.companyWebsite);
  if (rawUrl && !isValidUrl(rawUrl)) {
    errors.push('Please provide a valid company website URL.');
  }
  sanitized.companyWebsite = rawUrl ? normalizeUrl(rawUrl) : '';

  // Optional: Industry
  sanitized.industry = sanitize(data.industry) || 'Not Specified';

  // Optional: Company Size
  sanitized.companySize = sanitize(data.companySize) || 'Not Specified';

  // Optional: Additional Notes
  sanitized.notes = sanitize(data.notes) || '';

  return {
    valid: errors.length === 0,
    errors,
    sanitized,
  };
}

module.exports = { validateLeadData, isValidEmail, isValidUrl, sanitize, normalizeUrl };
