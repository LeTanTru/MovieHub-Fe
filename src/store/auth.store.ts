import type { AuthStoreType, ProfileResType } from '@/types';
import { create } from 'zustand';

const useAuthStore = create<AuthStoreType>((set) => ({
  profile: null,
  isLoggedOut: false,
  accessToken: null,

  setProfile: (profile: ProfileResType | null) => set({ profile }),
  setAccessToken: (accessToken: string | null) => set({ accessToken }),

  clearState: () =>
    set({
      profile: null,
      isLoggedOut: false,
      accessToken: null
    })
}));

export default useAuthStore;
