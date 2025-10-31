import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useStore } from '../../store';
import { AuthResponse, SignInData, SignUpData } from '../../types/auth';

export const useSignIn = () => {
  const { setAuth } = useStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SignInData): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>('/auth/signin', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (data: SignUpData) => {
      const response = await api.post('/auth/signup', data);
      return response.data;
    },
  });
};

export const useSignOut = () => {
  const { logout, user } = useStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (user) {
        await api.delete(`/auth/logout/${user.id}`);
      }
    },
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
};

export const useRefreshTokens = () => {
  const { setAuth, user } = useStore();

  return useMutation({
    mutationFn: async (refreshToken: string) => {
      const response = await api.post('/auth/refresh', { refreshToken });
      return response.data;
    },
    onSuccess: (data) => {
      if (user) {
        setAuth({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user,
        });
      }
    },
  });
};

export const useUserProfile = () => {
  const { user } = useStore();

  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const response = await api.get('/user/me');
      return response.data;
    },
    enabled: !!user,
  });
};
