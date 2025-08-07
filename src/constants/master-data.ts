import { GENDER_FEMALE, GENDER_MALE, GENDER_OTHER } from '@/constants/constant';
import { Infinity, LucideIcon, Mars, Venus } from 'lucide-react';

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
