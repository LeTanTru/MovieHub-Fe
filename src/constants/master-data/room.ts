import {
  ROOM_KIND_PRIVATE,
  ROOM_KIND_PUBLIC,
  ROOM_STATE_ALL,
  ROOM_STATE_ENDING,
  ROOM_STATE_PENDING,
  ROOM_STATE_RUNNING
} from '@/constants/constant';
import { OptionType } from '@/types';

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
