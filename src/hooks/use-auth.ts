import { useAuthStore } from '@/store';
import { ProfileResType } from '@/types';

export const useAuth = () => {
  const profile: ProfileResType | null = useAuthStore((s) => s.profile);
  return { isAuthenticated: !!profile, profile };
};
