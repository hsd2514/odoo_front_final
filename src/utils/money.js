// money.js - simple currency formatting

export function formatINR(amount) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  } catch {
    return `₹ ${Number(amount || 0).toFixed(0)}`;
  }
}


