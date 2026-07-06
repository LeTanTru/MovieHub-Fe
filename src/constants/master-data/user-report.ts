import type { OptionType } from '@/types';

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

export const videoReportReasons: OptionType[] = [
  {
    label: 'Video không phát được',
    value: 'Video không phát được'
  },
  {
    label: 'Video bị giật/lag',
    value: 'Video bị giật/lag'
  },
  {
    label: 'Âm thanh bị lỗi',
    value: 'Âm thanh bị lỗi'
  },
  {
    label: 'Phụ đề bị lỗi/sai',
    value: 'Phụ đề bị lỗi/sai'
  },
  {
    label: 'Chất lượng video kém',
    value: 'Chất lượng video kém'
  },
  {
    label: 'Video không khớp với nội dung phim/tập',
    value: 'Video không khớp với nội dung phim/tập'
  },
  {
    label: USER_REPORT_REASON_OTHER,
    value: USER_REPORT_REASON_OTHER
  }
];
