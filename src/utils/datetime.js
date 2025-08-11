// datetime.js - Date and time utility functions

// Convert date string to ISO timestamp (for backend API)
export function dateToTimestamp(dateString) {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    
    // Set to start of day in local timezone, then convert to UTC
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return Math.floor(localDate.getTime() / 1000); // Unix timestamp in seconds
  } catch (error) {
    console.error('Error converting date to timestamp:', error);
    return null;
  }
}

// Convert date string to ISO string (for display and form inputs)
export function dateToISOString(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    // Return YYYY-MM-DD format for form inputs
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error converting date to ISO string:', error);
    return '';
  }
}

// Validate that end date is after start date
export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) return { valid: false, error: 'Both start and end dates are required' };
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { valid: false, error: 'Invalid date format' };
    }
    
    // Set both dates to start of day for comparison
    const startOfDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endOfDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    
    if (endOfDay <= startOfDay) {
      return { valid: false, error: 'End date must be after start date' };
    }
    
    return { valid: true };
  } catch (error) {
    console.error('Error validating date range:', error);
    return { valid: false, error: 'Error validating dates' };
  }
}

// Calculate duration between two dates
export function calculateDuration(startDate, endDate, unit = 'day') {
  if (!startDate || !endDate) return 0;
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    switch (unit.toLowerCase()) {
      case 'hour':
        return Math.ceil(diffMs / (1000 * 60 * 60));
      case 'week':
        return Math.ceil(diffDays / 7);
      case 'month':
        return Math.ceil(diffDays / 30);
      default:
        return diffDays;
    }
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 0;
  }
}

// Format date for display
export function formatDateForDisplay(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return dateString;
  }
}

// Get current date in YYYY-MM-DD format
export function getCurrentDateString() {
  return new Date().toISOString().split('T')[0];
}

// Get tomorrow's date in YYYY-MM-DD format
export function getTomorrowDateString() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}


