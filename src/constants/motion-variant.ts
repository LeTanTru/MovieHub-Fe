import { Variants } from 'framer-motion';

export const dropdownAvatarMotion: Variants = {
  initial: {
    opacity: 0,
    scale: 0,
    x: 0,
    y: 0,
    transformOrigin: '80% -15px'
  },
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.1,
      ease: 'linear'
    }
  },
  exit: {
    opacity: 0,
    scale: 0,
    x: 0,
    y: 0,
    transition: {
      duration: 0.1,
      ease: 'linear'
    }
  }
};

export const dropdownNotificationMotion: Variants = {
  initial: {
    opacity: 0,
    scale: 0,
    x: 0,
    y: 0,
    transformOrigin: '87% -15px'
  },
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.1,
      ease: 'linear'
    }
  },
  exit: {
    opacity: 0,
    scale: 0,
    x: 0,
    y: 0,
    transition: {
      duration: 0.1,
      ease: 'linear'
    }
  }
};
