import api from './axios';

export async function loginAPI(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function registerAPI(name, email, password) {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
}

export async function getMeAPI() {
  const res = await api.get('/auth/me');
  return res.data;
}
