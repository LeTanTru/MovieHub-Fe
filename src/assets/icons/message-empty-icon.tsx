'use client';

import { useImperativeHandle } from 'react';
import { m, useAnimate } from 'framer-motion';
import { AnimatedIconHandle, AnimatedIconProps } from '@/types';

export function MessageEmptyIcon({
  size = 24,
  className = '',
  onClick,
  color = 'currentColor',
  iconClassName = 'icon',
  ref
}: AnimatedIconProps & { ref?: React.Ref<AnimatedIconHandle> }) {
  const [scope, animate] = useAnimate();

  const start = async () => {
    await animate(
      scope.current,
      {
        scale: [1, 0.8, 1.5, 1]
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
      className={className}
      animate={{
        y: [0, -6, 0],
        scale: [1, 1.08, 1]
      }}
      transition={{
        duration: 2.4,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop'
      }}
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
      <svg
        xmlnsXlink='http://www.w3.org/1999/xlink'
        id='Chat'
        width={24}
        height={25}
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className={iconClassName}
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M8.85402 19.2002L9.95339 20.2996C10.4 20.7461 11.1238 20.7461 11.5704 20.2996L12.6697 19.2002C12.983 18.8869 13.4072 18.7118 13.8499 18.7118H14.6768C16.359 18.7118 17.723 17.3478 17.723 15.6647V10.3157C17.723 8.63354 16.359 7.26953 14.6768 7.26953H6.8479C5.16479 7.26953 3.80078 8.63354 3.80078 10.3157V15.6647C3.80078 17.3478 5.16479 18.7118 6.8479 18.7118H7.67389C8.11656 18.7118 8.54074 18.8869 8.85402 19.2002Z'
          stroke='#AAAAAA'
          strokeWidth='1.5px'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
        />
        <path
          opacity='0.6'
          d='M7.87891 7.26979V6.49147C7.87891 4.8103 9.24096 3.44922 10.289 3.44922H18.7579C20.439 3.44922 21.8011 4.8103 21.8011 6.49147V11.8414C21.8011 13.5294 20.439 14.8905 18.7579 14.8905H17.9319C17.8618 14.8905 17.7927 14.8983 17.7227 14.9051'
          stroke='#AAAAAA'
          strokeWidth='1.5px'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
        />
        <m.g
          animate={{
            x: [0.3, 0.3, 0, -0.3, -0.3, -0.3, 0, 0.3, 0.3],
            y: [0, 0.3, 0.3, 0.3, 0, -0.3, -0.3, -0.3, 0]
          }}
          transition={{
            duration: 2.8,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
            times: [0, 0.125, 0.35, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
          }}
        >
          <path
            d='M12.9541 13.1211V13.1909M13.237 13.1361C13.237 13.2932 13.1095 13.4206 12.9524 13.4206C12.7953 13.4206 12.668 13.2932 12.668 13.1361C12.668 12.9789 12.7953 12.8516 12.9524 12.8516C13.1095 12.8516 13.237 12.9789 13.237 13.1361Z'
            stroke='#AAAAAA'
            strokeWidth='1.5px'
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
          />
        </m.g>
        <m.g
          animate={{
            x: [0.3, 0.3, 0, -0.3, -0.3, -0.3, 0, 0.3, 0.3],
            y: [0, 0.3, 0.3, 0.3, 0, -0.3, -0.3, -0.3, 0]
          }}
          transition={{
            duration: 2.8,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
            times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
          }}
        >
          <path
            d='M8.26858 13.1211V13.1909M8.55144 13.1361C8.55144 13.2932 8.42397 13.4206 8.26685 13.4206C8.10972 13.4206 7.98242 13.2932 7.98242 13.1361C7.98242 12.9789 8.10972 12.8516 8.26685 12.8516C8.42397 12.8516 8.55144 12.9789 8.55144 13.1361Z'
            stroke='#AAAAAA'
            strokeWidth='1.5px'
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
          />
        </m.g>
      </svg>
    </m.div>
  );
}
