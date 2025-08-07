import { AuthStoreType, ProfileType } from '@/types';
import { create } from 'zustand';

const useAuthStore = create<AuthStoreType>((set) => ({
  isAuthenticated: false,
  profile: null,
  loading: true,
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setProfile: (profile: ProfileType | null) => set({ profile }),
  setLoading: (loading: boolean) => set({ loading })
}));

export default useAuthStore;
