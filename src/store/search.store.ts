import { SearchStoreType } from '@/types';
import { create } from 'zustand';

const useSearchStore = create<SearchStoreType>((set) => ({
  keyword: '',

  setKeyword: (keyword) => set({ keyword })
}));

export default useSearchStore;
