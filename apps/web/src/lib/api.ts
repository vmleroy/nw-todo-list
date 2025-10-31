import axios from 'axios';
import { useStore } from '../store';

export const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api',
});

api.interceptors.request.use((config) => {
  const token = useStore.getState().sessionToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      useStore.getState().logout();
    }
    return Promise.reject(err);
  },
);
