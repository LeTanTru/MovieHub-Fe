import { useEffect, useRef, useState } from 'react';

export default function useClickOutside(callback?: () => void) {
  const [open, setOpen] = useState(false);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        nodeRef.current &&
        !nodeRef.current.contains(e.target as HTMLElement)
      ) {
        setOpen(false);
        callback?.();
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open, callback]);

  return {
    open,
    setOpen,
    nodeRef
  };
}
