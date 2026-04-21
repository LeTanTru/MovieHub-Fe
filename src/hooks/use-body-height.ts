import { useEffect, useState, RefObject } from 'react';

const useBodyHeight = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  dependencies: any[] = []
) => {
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (!ref.current) return;

    const updateHeight = () => {
      if (ref.current) {
        setHeight(ref.current.clientHeight);
      }
    };

    const timeoutId = setTimeout(updateHeight, 200);

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(ref.current);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [ref, dependencies]);

  return height;
};

export default useBodyHeight;
