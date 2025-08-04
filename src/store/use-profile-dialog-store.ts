import { create } from 'zustand';

type ProfileDialogStoreType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const useProfileDialogStore = create<ProfileDialogStoreType>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open })
}));

export default useProfileDialogStore;
