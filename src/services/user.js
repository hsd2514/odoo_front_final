// user.js - user-related API services
import http from './http';

export async function getMe() {
  const { data } = await http.get('/users/me');
  return data; // { user_id, email, full_name, roles: [] }
}


