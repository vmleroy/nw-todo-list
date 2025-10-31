import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';
import { AuthSlice, createAuthSlice } from './slices';

type StoreType = AuthSlice;

export const storeBase = create(
  persist(
    subscribeWithSelector<StoreType>((...a) => ({
      ...createAuthSlice(...a),
    })),
    {
      name: 'autonomy-edge-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessionToken: state.sessionToken,
      }),
    },
  ),
);

export const useStore = createSelectorHooks(storeBase);
