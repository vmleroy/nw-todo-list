'use client';

import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { api } from '../lib/api';

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth, logout, user, accessToken, refreshToken } = useStore();

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!accessToken || !refreshToken || !user) return;

    const refreshTokens = async () => {
      try {
        const response = await api.post('/auth/refresh', {
          refreshToken,
        });

        setAuth({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user,
        });
      } catch {
        logout();
      }
    };

    // Refresh token 1 minute before expiry (14 minutes for 15-minute tokens)
    const refreshInterval = setInterval(refreshTokens, 14 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [accessToken, refreshToken, user, setAuth, logout]);

  const signIn = async (data: AuthFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<AuthResponse>('/auth/signin', {
        email: data.email,
        password: data.password,
      });

      setAuth({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user: response.data.user,
      });

      return true;
    } catch (err) {
      const apiError = err as ApiError;
      const message = apiError?.response?.data?.message || 'Invalid credentials';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: AuthFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await api.post('/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      return true;
    } catch (err) {
      const apiError = err as ApiError;
      const message = apiError?.response?.data?.message || 'Registration failed';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    if (user && refreshToken) {
      try {
        await api.delete(`/auth/logout/${user.id}`);
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    logout();
  };

  const clearError = () => setError(null);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
    isAuthenticated: !!accessToken,
  };
};
