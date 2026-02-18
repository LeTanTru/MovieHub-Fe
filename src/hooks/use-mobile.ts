import { useEffect, useState } from 'react';

const useMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const ua = navigator.userAgent.toLowerCase();
    setIsMobile(/mobile|iphone|ipod|android.*mobile|windows phone/.test(ua));
  }, []);

  return isMobile;
};

export default useMobile;
