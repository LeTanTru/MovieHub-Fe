import { AuthDialogStoreType } from '@/types';
import { create } from 'zustand';

const useAuthDialogStore = create<AuthDialogStoreType>((set) => ({
  open: false,
  mode: 'login',
  setOpen: (open: boolean) => set({ open }),
  setMode: (mode: 'login' | 'register') => set({ mode })
}));

export default useAuthDialogStore;
