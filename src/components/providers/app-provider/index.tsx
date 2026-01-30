'use client';

import { useProfileQuery } from '@/queries';
import { useAppLoadingStore, useAuthStore } from '@/store';
import { getAccessTokenFromLocalStorage } from '@/utils';
import { useEffect } from 'react';

export default function AppProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const accessToken = getAccessTokenFromLocalStorage();
  const setProfile = useAuthStore((s) => s.setProfile);
  const setLoading = useAppLoadingStore((s) => s.setLoading);

  const {
    data: profile,
    isLoading,
    isFetching
  } = useProfileQuery({ enabled: !!accessToken });

  useEffect(() => {
    setLoading(isLoading || isFetching);
  }, [isFetching, isLoading, setLoading]);

  useEffect(() => {
    if (!profile?.data) return;

    if (profile.result && profile.data) {
      setProfile(profile.data);
    }
  }, [profile?.data, profile?.result, setProfile]);

  return <>{children}</>;
}
