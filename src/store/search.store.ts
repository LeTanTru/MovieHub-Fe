import type { SearchStoreType } from '@/types';
import { create } from 'zustand';

export const useSearchStore = create<SearchStoreType>((set) => ({
  keyword: '',

  setKeyword: (keyword) => set({ keyword })
}));
