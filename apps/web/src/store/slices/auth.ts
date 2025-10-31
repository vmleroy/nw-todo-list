import { UserEntity } from '@repo/api';
import { StateCreator } from 'zustand';

export interface AuthSlice {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserEntity | null;

  setAuth: (auth: { accessToken: string; refreshToken: string; user: UserEntity }) => void;
  logout: () => void;
  getAccessToken: () => string | null;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,

  setAuth: (auth) =>
    set({
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      user: auth.user,
    }),

  logout: () =>
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
    }),

  getAccessToken: () => get().accessToken,
});
