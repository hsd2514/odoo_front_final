// catalog.js - Catalog APIs
import http from './http';

export const CATEGORIES_PATH = import.meta.env.VITE_CATEGORIES_PATH || '/catalog/categories';
export const PRODUCTS_PATH = import.meta.env.VITE_PRODUCTS_PATH || '/catalog/products';

export async function listCategories() {
  const { data } = await http.get(CATEGORIES_PATH);
  return Array.isArray(data) ? data : (data?.items || []);
}

export async function listCatalogProducts({ category_id, q, active = true } = {}) {
  const params = {};
  if (category_id) params.category_id = category_id;
  if (q) params.q = q;
  if (active != null) params.active = active;
  const { data } = await http.get(PRODUCTS_PATH, { params });
  return Array.isArray(data) ? data : (data?.items || []);
}

export async function listProductAssets(productId) {
  const { data } = await http.get(`${PRODUCTS_PATH}/${productId}/assets`);
  return Array.isArray(data) ? data : (data?.items || []);
}

export async function getFirstAssetUrl(productId) {
  try {
    if (!productId && productId !== 0) return '';
    const assets = await listProductAssets(productId);
    const a = assets?.[0] || null;
    return a?.uri || a?.url || a?.image_url || a?.src || a?.thumbnail || '';
  } catch {
    return '';
  }
}

export async function getProduct(productId) {
  const { data } = await http.get(`${PRODUCTS_PATH}/${productId}`);
  return data;
}


