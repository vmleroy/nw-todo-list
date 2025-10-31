import axios from 'axios';
import { useStore } from '../store';

export const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api',
});

api.interceptors.request.use((config) => {
  const token = useStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err?.response?.status === 401) {
      const refreshToken = useStore.getState().refreshToken;
      
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')}/api/auth/refresh`,
            { refreshToken }
          );
          
          useStore.getState().setAuth({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            user: useStore.getState().user!,
          });
          
          // Retry original request
          err.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return axios.request(err.config);
        } catch {
          useStore.getState().logout();
        }
      } else {
        useStore.getState().logout();
      }
    }
    return Promise.reject(err);
  },
);
