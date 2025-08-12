// user.js - user-related API services
import http from './http';

export async function getMe() {
  const { data } = await http.get('/users/me');
  return data; // { user_id, email, full_name, roles: [] }
}

export async function getUserName(userId) {
  try {
    if (!userId && userId !== 0) return '';
    const { data } = await http.get(`/users/${userId}`);
    return data?.full_name || data?.name || data?.email || `User #${userId}`;
  } catch {
    return `User #${userId}`;
  }
}


