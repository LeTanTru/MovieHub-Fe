import { AuthDialogStoreType, AuthType } from '@/types';
import { create } from 'zustand';

const useAuthDialogStore = create<AuthDialogStoreType>((set) => ({
  open: false,
  mode: 'login',
  isSubmitting: false,
  setOpen: (open: boolean) => set({ open }),
  setMode: (mode: AuthType) => set({ mode }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting })
}));

export default useAuthDialogStore;
