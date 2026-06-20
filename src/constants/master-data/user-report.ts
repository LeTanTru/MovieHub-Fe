import { OptionType } from '@/types';

export const USER_REPORT_REASON_OTHER = 'Khác';

export const reportReasons: OptionType[] = [
  {
    label: 'Spam hoặc quảng cáo',
    value: 'Spam hoặc quảng cáo'
  },
  {
    label: 'Quấy rối hoặc công kích',
    value: 'Quấy rối hoặc công kích'
  },
  {
    label: 'Nội dung tiết lộ phim',
    value: 'Nội dung tiết lộ phim'
  },
  {
    label: 'Ngôn từ thù ghét hoặc phản cảm',
    value: 'Ngôn từ thù ghét hoặc phản cảm'
  },
  {
    label: 'Thông tin sai lệch',
    value: 'Thông tin sai lệch'
  },
  {
    label: 'Nội dung khiêu dâm hoặc không phù hợp',
    value: 'Nội dung khiêu dâm hoặc không phù hợp'
  },
  {
    label: 'Bạo lực hoặc kích động bạo lực',
    value: 'Bạo lực hoặc kích động bạo lực'
  },
  {
    label: 'Mạo danh người khác',
    value: 'Mạo danh người khác'
  },
  {
    label: 'Tiết lộ thông tin cá nhân',
    value: 'Tiết lộ thông tin cá nhân'
  },
  {
    label: 'Nội dung lừa đảo hoặc gian lận',
    value: 'Nội dung lừa đảo hoặc gian lận'
  },
  {
    label: 'Không liên quan đến nội dung phim',
    value: 'Không liên quan đến nội dung phim'
  },
  {
    label: 'Vi phạm bản quyền',
    value: 'Vi phạm bản quyền'
  },
  {
    label: USER_REPORT_REASON_OTHER,
    value: USER_REPORT_REASON_OTHER
  }
];
