import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if stored
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('epharmacy_user') || 'null');
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Gracefully purge invalid/expired credentials on 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const stored = localStorage.getItem('epharmacy_user');
      if (stored) {
        localStorage.removeItem('epharmacy_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
