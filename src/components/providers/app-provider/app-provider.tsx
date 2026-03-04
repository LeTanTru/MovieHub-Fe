'use client';

import { useProfileQuery } from '@/queries';
import { useAppLoadingStore, useAuthStore } from '@/store';
import { getAccessTokenFromLocalStorage, getData, removeDatas } from '@/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AppProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
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

  useEffect(() => {
    if (pathname !== '/intro') {
      const hasValidAccess = checkAccessExpiry();
      if (!hasValidAccess) {
        router.replace('/intro');
      }
    }
  }, [pathname, router]);

  useEffect(() => {
    const hasScroll = document.body.scrollHeight > window.innerHeight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.documentElement.style.setProperty(
      '--scroll-padding',
      hasScroll ? `${scrollbarWidth}px` : '0px'
    );
  }, []);

  return <>{children}</>;
}

export const checkAccessExpiry = (): boolean => {
  const accessGranted = getData('intro_access_granted');
  const expiryDate = getData('intro_access_expiry');

  if (!accessGranted || !expiryDate) {
    return false;
  }

  const now = new Date();
  const expiry = new Date(expiryDate);

  if (now > expiry) {
    removeDatas(['intro_access_granted', 'intro_access_expiry']);
    return false;
  }

  return true;
};
