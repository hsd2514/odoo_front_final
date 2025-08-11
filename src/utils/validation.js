// validation.js - Form validation utilities

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  // Check if it's 10-15 digits (international format)
  return /^\d{10,15}$/.test(cleanPhone);
};

/**
 * Validates credit card number using Luhn algorithm
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateCardNumber = (cardNumber) => {
  if (!cardNumber) return false;
  // Remove all non-digit characters
  const cleanNumber = cardNumber.replace(/\D/g, '');
  // Check if it's 13-19 digits
  if (!/^\d{13,19}$/.test(cleanNumber)) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Validates card expiry date
 * @param {string} expiry - Expiry date in MM/YY format
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateExpiry = (expiry) => {
  if (!expiry) return false;
  
  // Check format MM/YY
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  
  const [month, year] = expiry.split('/').map(Number);
  
  // Check month range
  if (month < 1 || month > 12) return false;
  
  // Check if expired
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};

/**
 * Validates CVV code
 * @param {string} cvv - CVV to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateCVV = (cvv) => {
  if (!cvv) return false;
  // CVV should be 3-4 digits
  return /^\d{3,4}$/.test(cvv);
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates postal code (basic format)
 * @param {string} postal - Postal code to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validatePostal = (postal) => {
  if (!postal) return false;
  // Allow 5-6 digits for most postal codes
  return /^\d{5,6}$/.test(postal);
};

/**
 * Gets validation error message for a field
 * @param {string} fieldName - Name of the field
 * @param {string} value - Value to validate
 * @param {string} fieldType - Type of field (phone, card, expiry, cvv, email, postal)
 * @returns {string} - Error message or empty string if valid
 */
export const getValidationError = (fieldName, value, fieldType) => {
  if (!value) return `${fieldName} is required`;
  
  switch (fieldType) {
    case 'phone':
      return validatePhone(value) ? '' : 'Please enter a valid phone number';
    case 'card':
      return validateCardNumber(value) ? '' : 'Please enter a valid card number';
    case 'expiry':
      return validateExpiry(value) ? '' : 'Please enter a valid expiry date (MM/YY)';
    case 'cvv':
      return validateCVV(value) ? '' : 'Please enter a valid CVV';
    case 'email':
      return validateEmail(value) ? '' : 'Please enter a valid email address';
    case 'postal':
      return validatePostal(value) ? '' : 'Please enter a valid postal code';
    default:
      return '';
  }
};
