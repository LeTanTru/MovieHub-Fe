import { ProfileType } from '@/types';
import { create } from 'zustand';

type AuthStoreType = {
  isAuthenticated: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;
  profile: ProfileType | null;
  setProfile: (profile: ProfileType | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const useAuthStore = create<AuthStoreType>((set) => ({
  isAuthenticated: false,
  profile: null,
  loading: true,
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setProfile: (profile: ProfileType | null) => set({ profile }),
  setLoading: (loading: boolean) => set({ loading })
}));

export default useAuthStore;
