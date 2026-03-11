'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { domAnimation, LazyMotion, m, useAnimate } from 'framer-motion';
import { AnimatedIconHandle, AnimatedIconProps } from '@/types';
import { RiTelegram2Fill } from 'react-icons/ri';

const TelegramIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
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
          y: [0, -10, 10, 0],
          x: [0, 10, -10, 0],
          opacity: [1, 0, 0, 1]
        },
        { duration: 0.6, ease: 'linear' }
      );
    };

    const stop = () => {
      animate(scope.current, { y: 0 }, { duration: 0.2, ease: 'linear' });
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
      <LazyMotion features={domAnimation}>
        <m.div
          ref={scope}
          onClick={handleClick}
          className={className}
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
          <RiTelegram2Fill className={iconClassName} />
        </m.div>
      </LazyMotion>
    );
  }
);

TelegramIcon.displayName = 'TelegramIcon';

export default TelegramIcon;
