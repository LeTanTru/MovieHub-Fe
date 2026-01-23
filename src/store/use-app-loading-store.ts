import { AppLoadingStoreType } from '@/types';
import { create } from 'zustand';

const useAppLoadingStore = create<AppLoadingStoreType>()((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading })
}));

export default useAppLoadingStore;
