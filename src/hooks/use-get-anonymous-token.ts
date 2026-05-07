import { useEffect, useState, useRef } from 'react';
import { getAnonymousToken } from '@/app/actions/anonymous';

const useAnonymousToken = () => {
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

    const interval = setInterval(handleGetToken, 14 * 60 * 1000); // Refresh token every 14 minutes
    handleGetToken();

    return () => clearInterval(interval);
  }, []);

  return { token, isLoadingToken };
};

export default useAnonymousToken;
