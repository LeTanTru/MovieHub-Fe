import {
  BREAKPOINT_DESKTOP,
  BREAKPOINT_MOBILE,
  BREAKPOINT_TABLET,
  KIND_ADMIN,
  KIND_MANAGER,
  KIND_USER_VIP
} from '@/constants/constant';

export const breakPoints = {
  mobile: BREAKPOINT_MOBILE,
  tablet: BREAKPOINT_TABLET,
  desktop: BREAKPOINT_DESKTOP
};

export const kindMaps: Record<number, { label: string; style: string }> = {
  [KIND_ADMIN]: {
    label: 'Super Admin',
    style: 'border-rose-500  text-rose-600'
  },
  [KIND_MANAGER]: {
    label: 'Admin',
    style: 'border-orange-500  text-orange-600'
  },
  [KIND_USER_VIP]: {
    label: 'VIP',
    style: 'border-cyan-500  text-cyan-600'
  }
};
