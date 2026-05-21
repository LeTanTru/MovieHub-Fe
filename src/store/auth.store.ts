import type { AuthStoreType, ProfileResType } from '@/types';
import { create } from 'zustand';

const useAuthStore = create<AuthStoreType>((set) => ({
  accessToken: null,
  csrfToken: null,
  profile: null,

  setAccessToken: (accessToken: string | null) => set({ accessToken }),
  setCsrfToken: (csrfToken) => set({ csrfToken }),
  setProfile: (profile: ProfileResType | null) => set({ profile }),

  clearState: () =>
    set({
      accessToken: null,
      csrfToken: null,
      profile: null
    })
}));

export default useAuthStore;
