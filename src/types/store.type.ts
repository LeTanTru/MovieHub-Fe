import { ProfileType } from '@/types/account.type';
import { AuthType } from '@/types/auth.type';

type AuthDialogState = {
  open: boolean;
  mode: AuthType;
  isSubmitting: boolean;
};

type AuthDialogActions = {
  setOpen: (open: boolean) => void;
  setMode: (mode: AuthType) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
};

export type AuthDialogStoreType = AuthDialogState & AuthDialogActions;

type AuthState = {
  profile: ProfileType | null;
};

type AuthActions = {
  setProfile: (profile: ProfileType | null) => void;
};

export type AuthStoreType = AuthState & AuthActions;
