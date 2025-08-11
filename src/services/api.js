// api.js
// Centralized API client and auth helpers

const isLocalhost = typeof window !== 'undefined' && window.location?.hostname === 'localhost';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (isLocalhost ? '' : 'https://7jirjbyvrd.loclx.io');
const LOGIN_PATH = import.meta.env.VITE_LOGIN_PATH || '/users/login';
const REGISTER_PATH = import.meta.env.VITE_REGISTER_PATH || '/users/register';

const AUTH_TOKEN_STORAGE_KEY = 'auth_token';

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '';
}

export function setAuthToken(token) {
  if (token) localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

async function request(path, { method = 'GET', body, headers } = {}) {
  const token = getAuthToken();
  const defaultHeaders = { 'Content-Type': 'application/json' };
  if (token) defaultHeaders['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { ...defaultHeaders, ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  const text = await response.text();
  try { data = text ? JSON.parse(text) : null; } catch { data = { message: text } }

  if (!response.ok) {
    let message = data?.message || data?.error;
    if (!message && Array.isArray(data?.detail) && data.detail.length > 0) {
      message = data.detail.map(d => d?.msg || '').filter(Boolean).join(', ');
    }
    if (!message) message = 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const auth = {
  async login(credentials) {
    return request(LOGIN_PATH, { method: 'POST', body: credentials });
  },
  async register(payload) {
    return request(REGISTER_PATH, { method: 'POST', body: payload });
  },
};

export const api = { request };
