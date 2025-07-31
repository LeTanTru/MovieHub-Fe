'use client';
import { accountApiRequest } from '@/apiRequests';
import { IChildren } from '@/interfaces';
import { logger } from '@/logger';
import { useProfileStore } from '@/store';
import { getAccessTokenFromLocalStorage } from '@/utils';
import { useEffect } from 'react';

export default function AppProvider({ children }: IChildren) {
  const { setProfile } = useProfileStore();

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const handleGetProfile = async () => {
        try {
          const response = await accountApiRequest.getProfile();
          const profile = response.data;
          setProfile(profile!);
        } catch (error) {
          logger.error('Error fetching profile:', error);
        }
      };
      handleGetProfile();
    }
  }, [setProfile]);
  return <div>{children}</div>;
}
