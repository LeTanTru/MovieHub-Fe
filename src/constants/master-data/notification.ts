import {
  NOTIFICATION_TYPE_COMMUNITY,
  NOTIFICATION_TYPE_MOVIE
} from '@/constants/constant';
import { OptionType } from '@/types';

export const notificationTabs: OptionType[] = [
  {
    value: NOTIFICATION_TYPE_MOVIE,
    label: 'Phim'
  },
  {
    value: NOTIFICATION_TYPE_COMMUNITY,
    label: 'Cộng đồng'
  }
];
