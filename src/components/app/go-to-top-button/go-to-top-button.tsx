'use client';

import { cn } from '@/lib';
import { ChevronUpIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function GoToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleGoTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      type='button'
      aria-label='Lên đầu trang'
      onClick={handleGoTop}
      className={cn(
        'fixed right-6 bottom-6 z-50 inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-sm transition-all duration-200 ease-linear hover:border-white/40 hover:bg-black/85',
        {
          'pointer-events-none translate-y-2 opacity-0': !isVisible,
          'translate-y-0 opacity-100': isVisible
        }
      )}
    >
      <ChevronUpIcon size={20} />
    </button>
  );
}
