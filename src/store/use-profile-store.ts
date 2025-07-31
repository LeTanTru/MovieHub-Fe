import { ProfileType } from '@/types';
import { create } from 'zustand';

type ProfileStoreType = {
  profile: ProfileType | null;
  setProfile: (profile: ProfileType | null) => void;
};

const useProfileStore = create<ProfileStoreType>((set) => ({
  profile: null,
  setProfile: (profile: ProfileType | null) => set({ profile })
}));
export default useProfileStore;
