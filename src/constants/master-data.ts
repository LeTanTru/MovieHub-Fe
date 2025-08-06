const GENDER_MALE = 1;
const GENDER_FEMALE = 2;
const GENDER_OTHER = 3;

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
