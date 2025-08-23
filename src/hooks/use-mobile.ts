import { useEffect, useState } from 'react';

export default function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const ua = navigator.userAgent.toLowerCase();
    setIsMobile(/mobile|iphone|ipod|android.*mobile|windows phone/.test(ua));
  }, []);

  return isMobile;
}
