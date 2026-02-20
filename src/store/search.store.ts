import { SearchStore } from '@/types';
import { create } from 'zustand';

const useSearchStore = create<SearchStore>((set) => ({
  keyword: '',

  setKeyword: (keyword) => set({ keyword })
}));

export default useSearchStore;
