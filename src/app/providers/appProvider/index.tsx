'use client';
import { IChildren } from '@/interfaces';
import { logger } from '@/logger';
import { useProfileQuery } from '@/queries/use-account';
import { useAuthStore } from '@/store';
import { getAccessTokenFromLocalStorage } from '@/utils';
import { useEffect } from 'react';

export default function AppProvider({ children }: IChildren) {
  const { isAuthenticated, setProfile, setLoading } = useAuthStore();
  const profileQuery = useProfileQuery();

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (!accessToken) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const handleGetProfile = async () => {
      setLoading(true);
      try {
        const response = await profileQuery.refetch();
        const profile = response.data?.data;
        setProfile(profile!);
      } catch (error) {
        logger.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    handleGetProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return <div>{children}</div>;
}
