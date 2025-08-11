// products.js - product API
import http from './http';

const PRODUCTS_PATH = import.meta.env.VITE_PRODUCTS_PATH || '/products';

export async function listProducts(params = {}) {
  const { data } = await http.get(PRODUCTS_PATH, { params });
  // Expecting data to be either an array or {items: []}
  const items = Array.isArray(data) ? data : (data?.items || []);
  return items;
}


