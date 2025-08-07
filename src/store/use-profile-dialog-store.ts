import { ProfileDialogStoreType } from '@/types';
import { create } from 'zustand';

const useProfileDialogStore = create<ProfileDialogStoreType>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open })
}));

export default useProfileDialogStore;
