'use client';

import { useProfileQuery, useSession } from '@/queries';
import { useAuthStore } from '@/store';
import { getData, removeData } from '@/utils';
import { domAnimation, LazyMotion } from 'framer-motion';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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

export default function AppProvider({ children }: AppProviderProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const { accessToken, setAccessToken, setProfile } = useAuthStore(
    useShallow((s) => ({
      accessToken: s.accessToken,
      setAccessToken: s.setAccessToken,
      setProfile: s.setProfile
    }))
  );

  const { data: session, isLoading: sessionLoading } = useSession();

  const { data: profile, isLoading: profileLoading } = useProfileQuery({
    enabled: !!accessToken
  });

  useEffect(() => {
    if (session?.accessToken) {
      setAccessToken(session.accessToken);
    }
  }, [session, setAccessToken]);

  useEffect(() => {
    if (profile) {
      setProfile(profile);
    }
  }, [profile, setProfile]);

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
      <AppContext.Provider
        value={{
          loading: loading || profileLoading || sessionLoading,
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
