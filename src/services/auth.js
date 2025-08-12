// auth.js - authentication-related API services
import http from './http';

export async function forgotPassword(email) {
  const { data } = await http.post('/users/forgot-password', { email });
  return data;
}

export async function resetPassword(token, newPassword, confirmPassword) {
  const { data } = await http.post('/users/reset-password', {
    token,
    new_password: newPassword,
    confirm_password: confirmPassword
  });
  return data;
}

export async function login(credentials) {
  const { data } = await http.post('/users/login', credentials);
  return data;
}

export async function register(userData) {
  const { data } = await http.post('/users/register', userData);
  return data;
}
