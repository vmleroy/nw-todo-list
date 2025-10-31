'use client';

import { useState } from 'react';
import { useStore } from '../store';
import { api } from '../lib/api';

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth, logout, user, sessionToken } = useStore();

  const signIn = async (data: AuthFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<AuthResponse>('/auth/signin', {
        email: data.email,
        password: data.password,
      });

      setAuth({
        sessionToken: response.data.token,
        user: response.data.user,
      });

      return true;
    } catch (err) {
      const message = err?.response?.data?.message || 'Invalid credentials';
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
      const message = err?.response?.data?.message || 'Registration failed';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    if (user && sessionToken) {
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
    isAuthenticated: !!user && !!sessionToken,
  };
};
