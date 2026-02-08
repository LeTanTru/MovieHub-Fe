export type AnimatedIconHandle = {
  startAnimation: () => Promise<void>;
  stopAnimation: () => void;
};

export type AnimatedIconProps = {
  size?: number;
  className?: string;
  onClick?: () => void;
  color?: string;
  iconClassName?: string;
};
