'use client';

import { useIsMounted } from '@/hooks';
import { useProfileQuery, useSession } from '@/queries';
import { useAuthStore } from '@/store';
import { getData, removeData } from '@/utils';
import { domAnimation, LazyMotion } from 'framer-motion';
import {
  createContext,
  ReactNode,
  useContext,
  useLayoutEffect,
  useState
} from 'react';
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

  useLayoutEffect(() => {
    if (session) {
      setAccessToken(session.accessToken);
      setCsrfToken(session.csrfToken);
      setUserKind(session.userKind);

      if (!session.accessToken || session.userKind === null) {
        setProfile(null);
      }
    }
  }, [session, setUserKind, setAccessToken, setCsrfToken, setProfile]);

  useLayoutEffect(() => {
    if (profile) {
      setProfile(profile);
    }
  }, [profile, setProfile]);

  const isSessionHydrating = Boolean(
    session?.accessToken &&
    session.userKind !== null &&
    (!accessToken || userKind === null)
  );
  const isProfileHydrating = Boolean(profile && !storedProfile);

  // useEffect(() => {
  //   if (pathname !== '/intro') {
  //     const hasValidAccess = checkAccessExpiry();
  //     if (!hasValidAccess) {
  //       navigate.replace('/intro');
  //     }
  //   }
  // }, [pathname, navigate]);

  return (
    <LazyMotion features={domAnimation} strict>
      <AppContext.Provider
        value={{
          loading:
            !isMounted ||
            loading ||
            sessionLoading ||
            isSessionHydrating ||
            profileLoading ||
            isProfileHydrating,
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
