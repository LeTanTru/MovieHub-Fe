import { useEffect, useState, useRef } from 'react';
import { getAnonymousToken } from '@/app/actions/anonymous';

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const TOKEN_REFRESH_INTERVAL_MINUTES = 14;

export const useAnonymousToken = () => {
  const [token, setToken] = useState<string>('');
  const [isLoadingToken, setIsLoadingToken] = useState<boolean>(true);
  const hasFetchedTokenRef = useRef<boolean>(false);

  useEffect(() => {
    if (hasFetchedTokenRef.current) return;
    hasFetchedTokenRef.current = true;

    const handleGetToken = async () => {
      const anonymousToken = await getAnonymousToken();
      setToken(anonymousToken?.access_token || '');
      setIsLoadingToken(false);
    };

    const interval = setInterval(
      handleGetToken,
      TOKEN_REFRESH_INTERVAL_MINUTES * SECONDS_PER_MINUTE * MS_PER_SECOND
    ); // Refresh token every 14 minutes
    handleGetToken();

    return () => clearInterval(interval);
  }, []);

  return { token, isLoadingToken };
};
