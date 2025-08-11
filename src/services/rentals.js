// rentals.js - rental order APIs
import http from './http';

export async function listOrders(params = {}) {
  const { status, invoice_status, q, page = 1, limit = 20 } = params;
  const { data } = await http.get('/rentals/orders', { params: { status, invoice_status, q, page, limit } });
  return data; // { items, total, page, limit }
}

export async function getOrder(rentalId) {
  const { data } = await http.get(`/rentals/orders/${rentalId}`);
  return data;
}

export async function createOrder(payload) {
  const { data } = await http.post('/rentals/orders', payload);
  return data;
}

export async function addOrderItem(rentalId, item) {
  const { data } = await http.post(`/rentals/orders/${rentalId}/items`, item);
  return data;
}

export async function patchOrderStatus(rentalId, status) {
  const { data } = await http.patch(`/rentals/orders/${rentalId}/status`, { status });
  return data;
}


