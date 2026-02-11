'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { FaCircleDown } from 'react-icons/fa6';
import { AnimatedIconHandle, AnimatedIconProps } from '@/types';

const DislikeIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
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
          scale: [1, 1.2, 1.2, 1],
          rotate: [0, 45, -45, 0]
        },
        { duration: 0.6, ease: 'linear' }
      );
    };

    const stop = () => {
      animate(
        scope.current,
        { scale: 1, rotate: 0, y: 0 },
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
      <motion.div
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
        <FaCircleDown className={iconClassName} />
      </motion.div>
    );
  }
);

DislikeIcon.displayName = 'DislikeIcon';

export default DislikeIcon;
