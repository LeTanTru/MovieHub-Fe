import { AnimatedIconHandle } from '@/types';
import { useRef } from 'react';

const useClickAnimation = () => {
  const iconRef = useRef<AnimatedIconHandle>(null);

  const startAnimation = async () => {
    await iconRef.current?.startAnimation();
  };

  return {
    iconRef,
    startAnimation
  };
};

export default useClickAnimation;
