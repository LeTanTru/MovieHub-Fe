import { GENDER_FEMALE, GENDER_MALE, GENDER_OTHER } from '@/constants/constant';
import route from '@/routes';
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

export const GENDER = [GENDER_MALE, GENDER_FEMALE, GENDER_OTHER];

export const genderOptions = [
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

type DropdownAvatarItemType = {
  link: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  className?: string;
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

export const userSidebarList = [
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
