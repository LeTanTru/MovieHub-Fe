'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { FaCircleUp } from 'react-icons/fa6';

type AnimatedIconHandle = {
  startAnimation: () => Promise<void>;
  stopAnimation: () => void;
};

type AnimatedIconProps = {
  size?: number;
  className?: string;
  onClick?: () => void;
  color?: string;
  iconClassName?: string;
};

const LikeIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
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
      await start();
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
        <FaCircleUp className={iconClassName} />
      </motion.div>
    );
  }
);

LikeIcon.displayName = 'LikeIcon';

export default LikeIcon;
