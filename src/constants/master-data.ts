import { GENDER_FEMALE, GENDER_MALE, GENDER_OTHER } from '@/constants/constant';
import {
  Bell,
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
    link: '/user/favorite',
    icon: Heart,
    className: 'fill-white stroke-0 size-5',
    title: 'Yêu thích'
  },
  {
    link: '/user/playlist',
    icon: ListVideo,
    className: 'size-5',
    title: 'Danh sách phát'
  },
  {
    link: '/user/watch-history',
    icon: History,
    className: 'size-5',
    title: 'Xem tiếp'
  },
  {
    link: '/user/notification',
    icon: Bell,
    title: 'Thông báo',
    className: 'size-5'
  },
  {
    link: '/user/profile',
    icon: User2,
    className: 'size-5',
    title: 'Hồ sơ'
  }
];
