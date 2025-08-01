import { create } from 'zustand';

type DialogStoreType = {
  open: boolean;
  mode: 'login' | 'register';
  setOpen: (open: boolean) => void;
  setMode: (mode: 'login' | 'register') => void;
};

const useDialogStore = create<DialogStoreType>((set) => ({
  open: false,
  mode: 'login',
  setOpen: (open: boolean) => set({ open }),
  setMode: (mode: 'login' | 'register') => set({ mode })
}));

export default useDialogStore;
