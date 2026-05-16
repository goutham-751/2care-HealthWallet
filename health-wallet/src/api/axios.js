import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor: attach Clerk JWT
api.interceptors.request.use(async (config) => {
  if (window.Clerk && window.Clerk.session) {
    try {
      const token = await window.Clerk.session.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('Error fetching Clerk token', err);
    }
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  res => res,
  err => Promise.reject(err)
);

export default api;
