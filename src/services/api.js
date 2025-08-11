// api.js - auth helpers on top of axios http
import http from './http';
import { AUTH_TOKEN_STORAGE_KEY, getAuthToken, setAuthToken, clearAuthToken } from './authStorage';
import { LOGIN_PATH, REGISTER_PATH } from './endpoints';

// paths centralized in endpoints.js

export { AUTH_TOKEN_STORAGE_KEY, getAuthToken, setAuthToken, clearAuthToken };

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
