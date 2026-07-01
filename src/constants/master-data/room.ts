import {
  ROOM_KIND_PRIVATE,
  ROOM_KIND_PUBLIC,
  ROOM_REASON_END,
  ROOM_REASON_HOST_LEFT,
  ROOM_REASON_TIMEOUT,
  ROOM_STATE_ALL,
  ROOM_STATE_ENDED,
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
    value: ROOM_STATE_ENDED
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

export const roomEndReasons: OptionType[] = [
  {
    label: 'Chủ phòng đã kết thúc buổi xem chung',
    value: ROOM_REASON_END
  },
  {
    label: 'Chủ phòng đã mất kết nối, phòng tự động kết thúc',
    value: ROOM_REASON_TIMEOUT
  },
  {
    label: 'Chủ phòng đã rời đi, phòng tự động kết thúc',
    value: ROOM_REASON_HOST_LEFT
  }
];
