import { ProfileType } from '@/types/account.type';
import { CategoryResType } from '@/types/category.type';

export type AuthDialogStoreType = {
  open: boolean;
  mode: 'login' | 'register';
  setOpen: (open: boolean) => void;
  setMode: (mode: 'login' | 'register') => void;
};

export type AuthStoreType = {
  isAuthenticated: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;
  profile: ProfileType | null;
  setProfile: (profile: ProfileType | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export type CategoryStoreType = {
  categories: CategoryResType[];
  setCategories: (categories: CategoryResType[]) => void;
};
