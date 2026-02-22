import { AuthStoreType, ProfileResType } from '@/types';
import { create } from 'zustand';

const useAuthStore = create<AuthStoreType>((set) => ({
  profile: null,
  setProfile: (profile: ProfileResType | null) => set({ profile })
}));

export default useAuthStore;
