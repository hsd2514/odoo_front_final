// reporting.js - reporting APIs
import http from './http';

export async function getSummary(params = {}) {
  const { from, to } = params;
  const { data } = await http.get('/reports/summary', { params: { from_ts: from, to_ts: to } });
  return data; // { kpi: {rentals,revenue}, top_products, top_categories }
}


