import { logger } from '@/logger';
import { useAppLoadingStore } from '@/store';
import { useEffect, useState } from 'react';

const useAppLoading = (name: string = '') => {
  const [mounted, setMounted] = useState<boolean>(false);
  const loading = useAppLoadingStore((state) => state.loading);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return true;

  if (name) {
    logger.info(`${name} loading =`, loading);
  }

  return loading;
};

export default useAppLoading;
