'use client';
import { accountApiRequest } from '@/apiRequests';
import { IChildren } from '@/interfaces';
import { logger } from '@/logger';
import { useProfileStore } from '@/store';
import { getAccessTokenFromLocalStorage } from '@/utils';
import { useEffect } from 'react';

export default function AppProvider({ children }: IChildren) {
  const { setProfile, setLoading } = useProfileStore();

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      setLoading(true);
      const handleGetProfile = async () => {
        try {
          const response = await accountApiRequest.getProfile();
          const profile = response.data;
          setProfile(profile!);
        } catch (error) {
          logger.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      };
      handleGetProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [setProfile, setLoading]);
  return <div>{children}</div>;
}
