import { route } from '@/routes';
import { DropdownAvatarItemType, UserSidebarItemType } from '@/types';
import { LockKeyhole, Settings } from 'lucide-react';
import { FaHistory } from 'react-icons/fa';
import { FaBell, FaHeart, FaList, FaUser } from 'react-icons/fa6';

export const dropdownAvatarList: DropdownAvatarItemType[] = [
  {
    link: route.user.favourite.path,
    icon: FaHeart,
    className: 'fill-white stroke-0 size-4',
    title: 'Yêu thích'
  },
  {
    link: route.user.playlist.path,
    icon: FaList,
    className: 'size-4',
    title: 'Danh sách phát'
  },
  {
    link: route.user.watchHistory.path,
    icon: FaHistory,
    className: 'size-4',
    title: 'Xem tiếp'
  },
  {
    link: route.account.profile.path,
    icon: FaUser,
    className: 'size-4',
    title: 'Tài khoản'
  }
];

export const dropdownAvatarAccountList: DropdownAvatarItemType[] = [
  {
    link: route.account.profile.path,
    icon: FaUser,
    className: 'size-4',
    title: 'Tài khoản'
  },
  {
    link: route.account.changePassword.path,
    icon: LockKeyhole,
    className: 'size-4',
    title: 'Đổi mật khẩu'
  },
  {
    link: route.account.settings.path,
    icon: Settings,
    className: 'size-4',
    title: 'Cài đặt'
  }
];

export const userSidebarList: UserSidebarItemType[] = [
  {
    link: route.user.favourite.path,
    icon: FaHeart,
    className: 'size-4',
    title: 'Yêu thích'
  },
  {
    link: route.user.playlist.path,
    icon: FaList,
    className: 'size-4',
    title: 'Danh sách phát'
  },
  {
    link: route.user.watchHistory.path,
    icon: FaHistory,
    className: 'size-4',
    title: 'Xem tiếp'
  },
  {
    link: route.user.notification.path,
    icon: FaBell,
    className: 'size-4',
    title: 'Thông báo'
  },
  {
    link: route.account.profile.path,
    icon: FaUser,
    className: 'size-4',
    title: 'Tài khoản'
  }
];
