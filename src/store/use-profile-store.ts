import { ProfileType } from '@/types';
import { create } from 'zustand';

type ProfileStoreType = {
  profile: ProfileType | null;
  setProfile: (profile: ProfileType) => void;
};

const useProfileStore = create<ProfileStoreType>((set) => ({
  profile: null,
  setProfile: (profile: ProfileType) => set({ profile })
}));
export default useProfileStore;
