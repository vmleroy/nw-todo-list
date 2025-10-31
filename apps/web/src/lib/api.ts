import axios from 'axios';
import { useStore } from '../store';

export const api = axios.create({
  baseURL: process.env.API_URL ?? '/api',
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
