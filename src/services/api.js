// api.js - auth helpers on top of axios http
import http from './http';

export const LOGIN_PATH = import.meta.env.VITE_LOGIN_PATH || '/users/login';
export const REGISTER_PATH = import.meta.env.VITE_REGISTER_PATH || '/users/register';

export const AUTH_TOKEN_STORAGE_KEY = 'auth_token';

export function getAuthToken() {
  try { return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || ''; } catch { return ''; }
}

export function setAuthToken(token) {
  try { if (token) localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token); } catch { /* noop */ }
}

export function clearAuthToken() {
  try { localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY); } catch { /* noop */ }
}

export const auth = {
  async login(credentials) {
    const { data } = await http.post(LOGIN_PATH, credentials);
    return data;
  },
  async register(payload) {
    const { data } = await http.post(REGISTER_PATH, payload);
    return data;
  },
};

export const api = { http };
