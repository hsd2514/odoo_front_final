// formatDate.js
// Helper function to format dates

export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString();
}
