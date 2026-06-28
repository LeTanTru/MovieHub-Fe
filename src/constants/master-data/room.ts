import {
  ROOM_KIND_PRIVATE,
  ROOM_KIND_PUBLIC,
  ROOM_STATE_ALL,
  ROOM_STATE_ENDING,
  ROOM_STATE_PENDING,
  ROOM_STATE_RUNNING,
  ROOM_TAB_LATEST,
  ROOM_TAB_POPULAR
} from '@/constants/constant';
import { OptionType } from '@/types';

export const roomActions: { key: string; label: string }[] = [
  { key: ROOM_TAB_LATEST, label: 'Mới nhất' },
  { key: ROOM_TAB_POPULAR, label: 'Phổ biến' }
];

export const roomStates: OptionType[] = [
  {
    label: 'Tất cả',
    value: ROOM_STATE_ALL
  },
  {
    label: 'Đang chiếu',
    value: ROOM_STATE_RUNNING
  },
  {
    label: 'Đang chờ',
    value: ROOM_STATE_PENDING
  },
  {
    label: 'Đã kết thúc',
    value: ROOM_STATE_ENDING
  }
];

export const roomKinds: OptionType[] = [
  {
    label: 'Công khai',
    value: ROOM_KIND_PUBLIC
  },
  {
    label: 'Riêng tư',
    value: ROOM_KIND_PRIVATE
  }
];
