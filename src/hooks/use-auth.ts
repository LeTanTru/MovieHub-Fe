import { useAuthStore } from '@/store';

const useAuth = () => {
  const profile = useAuthStore((s) => s.profile);

  return { isAuthenticated: !!profile, profile };
};

export default useAuth;
