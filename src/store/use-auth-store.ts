import { AuthStoreType, ProfileType } from '@/types';
import { create } from 'zustand';

const useAuthStore = create<AuthStoreType>((set) => ({
  profile: null,
  setProfile: (profile: ProfileType | null) => set({ profile })
}));

export default useAuthStore;
