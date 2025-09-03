'use client';
import { logger } from '@/logger';
import { useProfileQuery } from '@/queries';
import { useAuthStore } from '@/store';
import { getAccessTokenFromLocalStorage } from '@/utils';
import { useEffect } from 'react';

export default function AppProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, setProfile, setLoading } = useAuthStore();
  const profileQuery = useProfileQuery();

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const handleGetProfile = async () => {
      setLoading(true);
      try {
        const response = await profileQuery.refetch();
        const profile = response.data?.data;
        if (profile) {
          setProfile(profile);
        }
      } catch (error) {
        logger.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    handleGetProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return <>{children}</>;
}
