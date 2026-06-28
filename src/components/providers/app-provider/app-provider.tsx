'use client';

import { useIsMounted, useIsomorphicLayoutEffect, useNavigate } from '@/hooks';
import { useProfileQuery, useSession } from '@/queries';
import { route } from '@/routes';
import { useAuthStore } from '@/store';
import { getData, removeData } from '@/utils';
import { domAnimation, LazyMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { createContext, ReactNode, useContext, useState } from 'react';
import { useShallow } from 'zustand/shallow';

type AppContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const AppContext = createContext<AppContextType>({
  loading: false,
  setLoading: () => {}
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

type AppProviderProps = { children: ReactNode };

export function AppProvider({ children }: AppProviderProps) {
  const pathname = usePathname();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const isMounted = useIsMounted();

  const {
    accessToken,
    profile: storedProfile,
    userKind,
    setAccessToken,
    setCsrfToken,
    setProfile,
    setUserKind
  } = useAuthStore(
    useShallow((s) => ({
      accessToken: s.accessToken,
      profile: s.profile,
      userKind: s.userKind,
      setAccessToken: s.setAccessToken,
      setCsrfToken: s.setCsrfToken,
      setProfile: s.setProfile,
      setUserKind: s.setUserKind
    }))
  );

  const { data: session, isLoading: sessionLoading } = useSession();

  const { data: profile, isLoading: profileLoading } = useProfileQuery({
    enabled: !!accessToken
  });

  useIsomorphicLayoutEffect(() => {
    if (session) {
      setAccessToken(session.accessToken);
      setCsrfToken(session.csrfToken);
      setUserKind(session.userKind);

      if (!session.accessToken || session.userKind === null) {
        setProfile(null);
      }
    }
  }, [session, setUserKind, setAccessToken, setCsrfToken, setProfile]);

  useIsomorphicLayoutEffect(() => {
    if (profile) {
      setProfile(profile);

      if (!profile.isMakeSurvey && pathname !== route.survey.path) {
        navigate.push(route.survey.path);
      }
    }
  }, [navigate, pathname, profile, setProfile]);

  const isSessionPending =
    sessionLoading ||
    Boolean(
      session?.accessToken &&
      session.userKind !== null &&
      (!accessToken || userKind === null)
    );

  const isProfilePending = profileLoading || Boolean(profile && !storedProfile);

  const isAppLoading =
    !isMounted || isSessionPending || isProfilePending || loading;

  return (
    <LazyMotion features={domAnimation} strict>
      <AppContext.Provider
        value={{
          loading: isAppLoading,
          setLoading
        }}
      >
        {children}
      </AppContext.Provider>
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
