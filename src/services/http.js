// http.js - Axios client with interceptors
import axios from 'axios';

const isLocal = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
const envBase = import.meta.env.VITE_API_BASE_URL && String(import.meta.env.VITE_API_BASE_URL).trim();
// If env is provided, always use it (sends requests to that URL). Otherwise, on localhost use proxy ("")
export const apiBaseURL = envBase || (isLocal ? '' : '');

export const http = axios.create({ baseURL: apiBaseURL });

function getToken() {
  try {
    return localStorage.getItem('auth_token') || '';
  } catch {
    return '';
  }
}

export function clearToken() {
  try {
    localStorage.removeItem('auth_token');
  } catch {
    /* noop */
  }
}

// Request: attach bearer token
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: handle 401 and 4xx toasts
http.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const detail = error?.response?.data?.detail;
    const message = Array.isArray(detail)
      ? detail.map((d) => d?.msg || d).filter(Boolean).join(', ')
      : (detail || error?.response?.data?.message || error.message || 'Request failed');

    // simple toast fallback
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message } }));
    }

    if (status === 401) {
      clearToken();
      if (typeof window !== 'undefined') {
        const loginPath = '/auth/login';
        if (window.location.pathname !== loginPath) {
          window.location.assign(loginPath);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default http;


