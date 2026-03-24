'use client';

import { useNavigate } from '@/hooks';
import { useProfileQuery } from '@/queries';
import { useAppLoadingStore, useAuthStore } from '@/store';
import { getAccessTokenFromLocalStorage, getData, removeData } from '@/utils';
import { domAnimation, LazyMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AppProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const pathname = usePathname();
  const accessToken = getAccessTokenFromLocalStorage();
  const setProfile = useAuthStore((s) => s.setProfile);
  const setLoading = useAppLoadingStore((s) => s.setLoading);

  const { data: profile, isLoading } = useProfileQuery({
    enabled: !!accessToken
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (!profile?.data) return;

    if (profile.result && profile.data) {
      setProfile(profile.data);
    }
  }, [profile?.data, profile?.result, setProfile]);

  // useEffect(() => {
  //   if (pathname !== '/intro') {
  //     const hasValidAccess = checkAccessExpiry();
  //     if (!hasValidAccess) {
  //       navigate.replace('/intro');
  //     }
  //   }
  // }, [pathname, navigate]);

  useEffect(() => {
    const hasScroll = document.body.scrollHeight > window.innerHeight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.documentElement.style.setProperty(
      '--scroll-padding',
      hasScroll ? `${scrollbarWidth}px` : '0px'
    );
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
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
    removeData(['intro_access_granted', 'intro_access_expiry']);
    return false;
  }

  return true;
};
