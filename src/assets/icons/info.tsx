'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { m, useAnimate } from 'framer-motion';
import { FaCircleInfo } from 'react-icons/fa6';
import { AnimatedIconHandle, AnimatedIconProps } from '@/types';

const InfoIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    {
      size = 24,
      className = '',
      onClick,
      color = 'currentColor',
      iconClassName = 'icon'
    },
    ref
  ) => {
    const [scope, animate] = useAnimate();

    const start = async () => {
      await animate(
        scope.current,
        {
          scale: [1, 1.5, 0.8, 1]
        },
        { duration: 0.6, ease: 'linear' }
      );
    };

    const stop = () => {
      animate(
        scope.current,
        { scale: 1, y: 0 },
        { duration: 0.2, ease: 'linear' }
      );
    };

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop
    }));

    const handleClick = async () => {
      start();
      onClick?.();
    };

    return (
      <m.div
        ref={scope}
        onClick={handleClick}
        className={`${className} cursor-pointer`}
        style={{
          transformOrigin: 'center',
          fontSize: size,
          color,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <FaCircleInfo className={iconClassName} />
      </m.div>
    );
  }
);

InfoIcon.displayName = 'InfoIcon';

export default InfoIcon;
