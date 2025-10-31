'use client';

import { useEffect } from 'react';
import { useStore } from '../store';
import { useRefreshTokens, useSignIn, useSignOut, useSignUp } from './operations/useAuth';

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const { user, accessToken, refreshToken, logout } = useStore();
  
  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const signOutMutation = useSignOut();
  const refreshMutation = useRefreshTokens();

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!accessToken || !refreshToken || !user) return;

    const refreshTokens = async () => {
      try {
        await refreshMutation.mutateAsync(refreshToken);
      } catch {
        logout();
      }
    };

    // Refresh token 1 minute before expiry (14 minutes for 15-minute tokens)
    const refreshInterval = setInterval(refreshTokens, 14 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [accessToken, refreshToken, user, refreshMutation, logout]);

  const signIn = async (data: AuthFormData): Promise<boolean> => {
    try {
      await signInMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
      return true;
    } catch {
      return false;
    }
  };

  const signUp = async (data: AuthFormData): Promise<boolean> => {
    try {
      await signUpMutation.mutateAsync({
        name: data.name!,
        email: data.email,
        password: data.password,
      });
      return true;
    } catch {
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    await signOutMutation.mutateAsync();
  };

  return {
    user,
    loading: signInMutation.isPending || signUpMutation.isPending || signOutMutation.isPending,
    error: signInMutation.error?.message || signUpMutation.error?.message || signOutMutation.error?.message || null,
    signIn,
    signUp,
    signOut,
    clearError: () => {
      signInMutation.reset();
      signUpMutation.reset();
      signOutMutation.reset();
    },
    isAuthenticated: !!accessToken,
  };
};
