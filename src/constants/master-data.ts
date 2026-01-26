import {
  AGE_RATING_18,
  AGE_RATING_G,
  AGE_RATING_NC17,
  AGE_RATING_PG,
  AGE_RATING_PG13,
  AGE_RATING_R,
  BREAKPOINT_DESKTOP,
  BREAKPOINT_MOBILE,
  BREAKPOINT_TABLET,
  GENDER_FEMALE,
  GENDER_MALE,
  GENDER_OTHER,
  MOVIE_ITEM_KIND_EPISODE,
  MOVIE_ITEM_KIND_SEASON,
  MOVIE_ITEM_KIND_TRAILER,
  MOVIE_KIND_SERIES,
  MOVIE_KIND_SINGLE
} from '@/constants/constant';
import { route } from '@/routes';
import {
  DropdownAvatarItemType,
  OptionType,
  UserSidebarItemType
} from '@/types';
import {
  BellIcon,
  Heart,
  History,
  Infinity,
  ListVideo,
  LucideIcon,
  Mars,
  User2,
  Venus
} from 'lucide-react';

export const GENDER: number[] = [GENDER_MALE, GENDER_FEMALE, GENDER_OTHER];

export const genderOptions: OptionType[] = [
  { value: GENDER_MALE, label: 'Nam' },
  { value: GENDER_FEMALE, label: 'Nữ' },
  { value: GENDER_OTHER, label: 'Khác' }
];

const UPLOAD_AVATAR = 'AVATAR';

export const uploadOptions = {
  AVATAR: UPLOAD_AVATAR
};

export const genderIconMaps: Record<number, LucideIcon> = {
  [GENDER_MALE]: Mars,
  [GENDER_FEMALE]: Venus,
  [GENDER_OTHER]: Infinity
};

export const dropdownAvatarList: DropdownAvatarItemType[] = [
  {
    link: route.user.favorite.path,
    icon: Heart,
    className: 'fill-white stroke-0 size-5',
    title: 'Yêu thích'
  },
  {
    link: route.user.playlist.path,
    icon: ListVideo,
    className: 'size-5',
    title: 'Danh sách phát'
  },
  {
    link: route.user.watchHistory.path,
    icon: History,
    className: 'size-5',
    title: 'Xem tiếp'
  },
  {
    link: route.user.profile.path,
    icon: User2,
    className: 'size-5',
    title: 'Hồ sơ'
  }
];

export const userSidebarList: UserSidebarItemType[] = [
  {
    link: route.user.favorite.path,
    icon: Heart,
    className: 'fill-white stroke-0 size-5',
    title: 'Yêu thích'
  },
  {
    link: route.user.playlist.path,
    icon: ListVideo,
    className: 'size-5',
    title: 'Danh sách phát'
  },
  {
    link: route.user.watchHistory.path,
    icon: History,
    className: 'size-5',
    title: 'Xem tiếp'
  },
  {
    link: route.user.notification.path,
    icon: BellIcon,
    className: 'size-5',
    title: 'Thông báo'
  },
  {
    link: route.user.profile.path,
    icon: User2,
    className: 'size-5',
    title: 'Hồ sơ'
  }
];

export const breakPoints = {
  mobile: BREAKPOINT_MOBILE,
  tablet: BREAKPOINT_TABLET,
  desktop: BREAKPOINT_DESKTOP
};

export const ageRatings: { value: number | string; label: string }[] = [
  { value: AGE_RATING_G, label: 'G' },
  { value: AGE_RATING_PG, label: 'PG' },
  {
    value: AGE_RATING_PG13,
    label: 'PG-13'
  },
  { value: AGE_RATING_R, label: 'R' },
  {
    value: AGE_RATING_NC17,
    label: 'NC-17'
  },
  { value: AGE_RATING_18, label: '18+' }
];

export const movieItemKinds = {
  MOVIE_ITEM_KIND_TRAILER,
  MOVIE_ITEM_KIND_EPISODE,
  MOVIE_ITEM_KIND_SEASON
};

export const movieKinds = {
  MOVIE_KIND_SINGLE,
  MOVIE_KIND_SERIES
};

export const queryKeys = {
  FILE: 'file',
  FORGOT_PASSWORD: 'forgot-password',
  LOGIN_GOOGLE: 'login_google',
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'register',
  REQUEST_FORGOT_PASSSWORD: 'request-forgot-password',
  RESEND_OTP: 'resend-otp'
};
