import { ProfileType, RegisterType } from '@/types';
import { ErrorMaps } from '@/types/form-error.type';

export const ErrorCode = {
  ERROR_ACCOUNT_ERROR_0004: 'ERROR-ACCOUNT-ERROR-0004',
  ERROR_USER_ERROR_0002: 'ERROR-USER-ERROR-0002',
  ERROR_USER_ERROR_0003: 'ERROR-USER-ERROR-0003'
} as const;

export const registerErrorMaps: ErrorMaps<RegisterType> = {
  [ErrorCode.ERROR_ACCOUNT_ERROR_0004]: [
    ['email', { type: 'manual', message: 'Email đã tồn tại' }]
  ]
};

export const profileErrorMaps: ErrorMaps<ProfileType> = {
  [ErrorCode.ERROR_USER_ERROR_0002]: [
    ['username', { type: 'manual', message: 'Tên hiển thị đã tồn tại' }]
  ],
  [ErrorCode.ERROR_USER_ERROR_0003]: [
    ['phone', { type: 'manual', message: 'Số điện thoại đã tồn tại' }]
  ]
};
