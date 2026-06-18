import {
  GENDER_FEMALE,
  GENDER_MALE,
  GENDER_OTHER,
  UPLOAD_AVATAR
} from '@/constants/constant';
import { OptionType } from '@/types';
import { FaInfinity, FaMars, FaVenus } from 'react-icons/fa6';
import { IconType } from 'react-icons/lib';

export const GENDER: number[] = [GENDER_MALE, GENDER_FEMALE, GENDER_OTHER];

export const genderOptions: OptionType[] = [
  { value: GENDER_MALE, label: 'Nam' },
  { value: GENDER_FEMALE, label: 'Nữ' },
  { value: GENDER_OTHER, label: 'Khác' }
];

export const uploadOptions = {
  AVATAR: UPLOAD_AVATAR
};

export const genderIconMaps: Record<number, IconType> = {
  [GENDER_MALE]: FaMars,
  [GENDER_FEMALE]: FaVenus,
  [GENDER_OTHER]: FaInfinity
};
