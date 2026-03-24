import { AppLoadingStoreType } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useAppLoadingStore = create<AppLoadingStoreType>()(
  devtools((set) => ({
    loading: false,
    setLoading: (loading) => set({ loading })
  }))
);

export default useAppLoadingStore;
