import {
  AGE_RATING_18_PLUS,
  AGE_RATING_GENERAL,
  AGE_RATING_NC17,
  AGE_RATING_PG,
  AGE_RATING_PG13,
  AGE_RATING_R,
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

export const ageRatings = [
  {
    value: AGE_RATING_GENERAL,
    label: 'G',
    mean: 'Phù hợp với mọi lứa tuổi'
  },
  {
    value: AGE_RATING_PG,
    label: 'PG',
    mean: 'Dành cho khán giả dưới 13 tuổi khi có cha mẹ hoặc người giám hộ đi cùng'
  },
  {
    value: AGE_RATING_PG13,
    label: 'PG-13',
    mean: 'Dành cho khán giả từ đủ 13 tuổi trở lên'
  },
  {
    value: AGE_RATING_R,
    label: 'R',
    mean: 'Dành cho khán giả từ đủ 16 tuổi trở lên'
  },
  {
    value: AGE_RATING_NC17,
    label: 'NC-17',
    mean: 'Dành cho khán giả từ đủ 18 tuổi trở lên'
  },
  {
    value: AGE_RATING_18_PLUS,
    label: '18+',
    mean: 'Nội dung chỉ dành cho người trưởng thành từ 18 tuổi trở lên'
  }
];

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
