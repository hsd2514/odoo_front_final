// http.js - Axios client with interceptors
import axios from 'axios';
import { getAuthToken, clearAuthToken } from './authStorage';

const isLocal = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
const envBase = import.meta.env.VITE_API_BASE_URL && String(import.meta.env.VITE_API_BASE_URL).trim();
// If env is provided, always use it (sends requests to that URL). Otherwise, on localhost use proxy ("")
export const apiBaseURL = envBase || (isLocal ? '' : '');

// Disable axios timeout to avoid 15000ms errors on slow tunnels; rely on browser/network timeouts
export const http = axios.create({ baseURL: apiBaseURL, timeout: 0 });

// Request: attach bearer token
http.interceptors.request.use((config) => {
  const token = getAuthToken();
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
      clearAuthToken();
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


