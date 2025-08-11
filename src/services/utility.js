// utility.js - availability and notifications helpers
import http from './http';

export async function checkAvailability({ product_id, from_ts, to_ts }) {
  const { data } = await http.get('/utility/availability', { params: { product_id, from_ts, to_ts } });
  return data; // { available: boolean, reason?: string }
}


