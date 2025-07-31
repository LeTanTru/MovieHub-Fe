import { ProfileType } from '@/types';
import { create } from 'zustand';

type ProfileStoreType = {
  profile: ProfileType | null;
  setProfile: (profile: ProfileType | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const useProfileStore = create<ProfileStoreType>((set) => ({
  profile: null,
  loading: true,
  setProfile: (profile: ProfileType | null) => set({ profile }),
  setLoading: (loading: boolean) => set({ loading })
}));
export default useProfileStore;
