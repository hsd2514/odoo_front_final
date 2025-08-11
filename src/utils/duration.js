// duration.js - unit calculation mirroring backend (ceil)

import { dateToTimestamp } from './datetime';

export function durationUnits(unit, start, end) {
  // Convert dates to timestamps for calculation
  const startTs = dateToTimestamp(start);
  const endTs = dateToTimestamp(end);
  
  if (!startTs || !endTs || endTs <= startTs) return 0;
  
  // Calculate duration in seconds
  const durationSeconds = endTs - startTs;
  
  // Convert to different units
  const hour = 60 * 60;        // seconds in an hour
  const day = hour * 24;       // seconds in a day
  const week = day * 7;        // seconds in a week
  const month = day * 30;      // simplified calendar month approximation
  
  switch ((unit || '').toLowerCase()) {
    case 'hour':
    case 'hours':
      return Math.ceil(durationSeconds / hour);
    case 'day':
    case 'days':
      return Math.ceil(durationSeconds / day);
    case 'week':
    case 'weeks':
      return Math.ceil(durationSeconds / week);
    case 'month':
    case 'months':
      return Math.ceil(durationSeconds / month);
    default:
      return Math.ceil(durationSeconds / day);
  }
}

// Alternative function that works with Date objects directly
export function durationUnitsFromDates(unit, startDate, endDate) {
  if (!startDate || !endDate) return 0;
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return 0;
    
    const ms = end.getTime() - start.getTime();
    const hour = 1000 * 60 * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    
    switch ((unit || '').toLowerCase()) {
      case 'hour':
      case 'hours':
        return Math.ceil(ms / hour);
      case 'day':
      case 'days':
        return Math.ceil(ms / day);
      case 'week':
      case 'weeks':
        return Math.ceil(ms / week);
      case 'month':
      case 'months':
        return Math.ceil(ms / month);
      default:
        return Math.ceil(ms / day);
    }
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 0;
  }
}


