import { ChangePasswordBodyType, UpdateProfileBodyType } from '@/types';
import { ErrorMaps } from '@/types/form-error.type';
import { ErrorCode } from './error-code';

export const profileErrorMaps: ErrorMaps<UpdateProfileBodyType> = {
  [ErrorCode.USER_ERROR_USERNAME_EXISTED]: [
    ['username', { type: 'manual', message: 'Tên hiển thị đã tồn tại' }]
  ],
  [ErrorCode.USER_ERROR_PHONE_EXISTED]: [
    ['phone', { type: 'manual', message: 'Số điện thoại đã tồn tại' }]
  ]
};

export const changePasswordErrorMaps: ErrorMaps<ChangePasswordBodyType> = {
  [ErrorCode.USER_ERROR_WRONG_PASSWORD]: [
    [
      'oldPassword',
      {
        type: 'manual',
        message: 'Mật khẩu cũ không chính xác'
      }
    ]
  ],
  [ErrorCode.USER_ERROR_NEW_PASSWORD_SAME_OLD_PASSWORD]: [
    [
      'newPassword',
      {
        type: 'manual',
        message: 'Mật khẩu mới không được trùng với mật khẩu cũ'
      }
    ]
  ],
  [ErrorCode.USER_ERROR_CONFIRM_PASSWORD_INVALID]: [
    [
      'confirmNewPassword',
      {
        type: 'manual',
        message: 'Mật khẩu nhập lại không chính xác'
      }
    ]
  ]
};
