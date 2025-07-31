import { create } from 'zustand';

type AuthStoreType = {
  open: boolean;
  mode: 'login' | 'register';
  setOpen: (open: boolean) => void;
  setMode: (mode: 'login' | 'register') => void;
};

const useDialogStore = create<AuthStoreType>((set) => ({
  open: false,
  mode: 'login',
  setOpen: (open: boolean) => set({ open }),
  setMode: (mode: 'login' | 'register') => set({ mode })
}));

export default useDialogStore;
