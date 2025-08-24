import {
  BREAKPOINT_DESKTOP,
  BREAKPOINT_MOBILE,
  BREAKPOINT_TABLET,
  GENDER_FEMALE,
  GENDER_MALE,
  GENDER_OTHER
} from '@/constants/constant';
import route from '@/routes';
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
    link: route.user.favorite,
    icon: Heart,
    className: 'fill-white stroke-0 size-5',
    title: 'Yêu thích'
  },
  {
    link: route.user.playlist,
    icon: ListVideo,
    className: 'size-5',
    title: 'Danh sách phát'
  },
  {
    link: route.user.watchHistory,
    icon: History,
    className: 'size-5',
    title: 'Xem tiếp'
  },
  {
    link: route.user.profile,
    icon: User2,
    className: 'size-5',
    title: 'Hồ sơ'
  }
];

export const userSidebarList: UserSidebarItemType[] = [
  {
    link: route.user.favorite,
    icon: Heart,
    className: 'fill-white stroke-0 size-5',
    title: 'Yêu thích'
  },
  {
    link: route.user.playlist,
    icon: ListVideo,
    className: 'size-5',
    title: 'Danh sách phát'
  },
  {
    link: route.user.watchHistory,
    icon: History,
    className: 'size-5',
    title: 'Xem tiếp'
  },
  {
    link: route.user.notification,
    icon: BellIcon,
    className: 'size-5',
    title: 'Thông báo'
  },
  {
    link: route.user.profile,
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
