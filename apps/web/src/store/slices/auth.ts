import { StateCreator } from 'zustand';
import { User } from '../../types/user';

export interface AuthSlice {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  setAuth: (auth: { accessToken: string; refreshToken: string; user: User }) => void;
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
