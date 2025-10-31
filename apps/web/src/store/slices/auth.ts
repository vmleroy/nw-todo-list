import { StateCreator } from 'zustand';
import { User } from '../../types/user';

export interface AuthSlice {
  sessionToken: string | null;
  user: User | null;

  setAuth: (auth: { sessionToken: string; user: User }) => void;
  logout: () => void;
  getSessionToken: () => string | null;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  sessionToken: null,
  user: null,

  setAuth: (auth) =>
    set({
      sessionToken: auth.sessionToken,
      user: auth.user,
    }),

  logout: () =>
    set({
      sessionToken: null,
      user: null,
    }),

  getSessionToken: () => get().sessionToken,
});
