import { CategoryResType, CategoryStoreType } from '@/types';
import { create } from 'zustand';

export const useCategoryStore = create<CategoryStoreType>((set) => ({
  categories: [],
  setCategories: (categories: CategoryResType[]) => set({ categories })
}));
