import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

let authTokenGetter = null;

export function setAuthTokenGetter(getter) {
  authTokenGetter = getter;
}

// Request interceptor: attach Clerk JWT
api.interceptors.request.use(async (config) => {
  try {
    const token = authTokenGetter
      ? await authTokenGetter()
      : await window.Clerk?.session?.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error('Error fetching Clerk token', err);
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  res => res,
  err => Promise.reject(err)
);

export default api;
