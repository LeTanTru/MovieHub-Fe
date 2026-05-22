import type { AuthStoreType, ProfileResType } from '@/types';
import { create } from 'zustand';

const useAuthStore = create<AuthStoreType>((set) => ({
  csrfToken: null,
  profile: null,

  setCsrfToken: (csrfToken) => set({ csrfToken }),
  setProfile: (profile: ProfileResType | null) => set({ profile }),

  clearState: () =>
    set({
      csrfToken: null,
      profile: null
    })
}));

export default useAuthStore;
