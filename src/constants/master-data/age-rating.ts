import {
  AGE_RATING_18_PLUS,
  AGE_RATING_GENERAL,
  AGE_RATING_NC17,
  AGE_RATING_PG,
  AGE_RATING_PG13,
  AGE_RATING_R
} from '@/constants/constant';

export const ageRatings = [
  {
    value: AGE_RATING_GENERAL,
    label: 'G',
    mean: 'Phù hợp với mọi lứa tuổi'
  },
  {
    value: AGE_RATING_PG,
    label: 'PG',
    mean: 'Dành cho khán giả dưới 13 tuổi khi có cha mẹ hoặc người giám hộ đi cùng'
  },
  {
    value: AGE_RATING_PG13,
    label: 'PG-13',
    mean: 'Dành cho khán giả từ đủ 13 tuổi trở lên'
  },
  {
    value: AGE_RATING_R,
    label: 'R',
    mean: 'Dành cho khán giả từ đủ 16 tuổi trở lên'
  },
  {
    value: AGE_RATING_NC17,
    label: 'NC-17',
    mean: 'Dành cho khán giả từ đủ 18 tuổi trở lên'
  },
  {
    value: AGE_RATING_18_PLUS,
    label: '18+',
    mean: 'Nội dung chỉ dành cho người trưởng thành từ 18 tuổi trở lên'
  }
];
