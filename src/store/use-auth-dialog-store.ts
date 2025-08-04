import { create } from 'zustand';

type AuthDialogStoreType = {
  open: boolean;
  mode: 'login' | 'register';
  setOpen: (open: boolean) => void;
  setMode: (mode: 'login' | 'register') => void;
};

const useAuthDialogStore = create<AuthDialogStoreType>((set) => ({
  open: false,
  mode: 'login',
  setOpen: (open: boolean) => set({ open }),
  setMode: (mode: 'login' | 'register') => set({ mode })
}));

export default useAuthDialogStore;
