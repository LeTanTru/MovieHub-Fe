import { CategoryResType, CategoryStoreType } from '@/types';
import { create } from 'zustand';

const useCategoryStore = create<CategoryStoreType>((set) => ({
  categories: [],
  setCategories: (categories: CategoryResType[]) => set({ categories })
}));

export default useCategoryStore;
