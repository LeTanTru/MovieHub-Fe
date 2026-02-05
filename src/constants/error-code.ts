import {
  ChangePasswordBodyType,
  ForgotPasswordBodyType,
  ProfileType,
  RegisterType,
  VerifyOtpBodyType
} from '@/types';
import { ErrorMaps } from '@/types/form-error.type';

export const ErrorCode = {
  ACCOUNT_ERROR_NOT_FOUND: 'ERROR-ACCOUNT-ERROR-0000',

  ACCOUNT_ERROR_EMAIL_EXISTED: 'ERROR-ACCOUNT-ERROR-0004',

  USER_ERROR_USERNAME_EXISTED: 'ERROR-USER-ERROR-0002',
  USER_ERROR_PHONE_EXISTED: 'ERROR-USER-ERROR-0003',
  USER_ERROR_WRONG_PASSWORD: 'ERROR-USER-ERROR-0005',
  USER_ERROR_NEW_PASSWORD_SAME_OLD_PASSWORD: 'ERROR-USER-ERROR-0006',
  USER_ERROR_OTP_INVALID: 'ERROR-USER-ERROR-0007',
  USER_ERROR_CONFIRM_PASSWORD_INVALID: 'ERROR-USER-ERROR-0009'
} as const;

export const registerErrorMaps: ErrorMaps<RegisterType> = {
  [ErrorCode.ACCOUNT_ERROR_EMAIL_EXISTED]: [
    ['email', { type: 'manual', message: 'Email đã tồn tại' }]
  ]
};

export const profileErrorMaps: ErrorMaps<ProfileType> = {
  [ErrorCode.USER_ERROR_USERNAME_EXISTED]: [
    ['username', { type: 'manual', message: 'Tên hiển thị đã tồn tại' }]
  ],
  [ErrorCode.USER_ERROR_PHONE_EXISTED]: [
    ['phone', { type: 'manual', message: 'Số điện thoại đã tồn tại' }]
  ]
};

export const forgotPasswordErrorMaps: ErrorMaps<ForgotPasswordBodyType> = {
  [ErrorCode.ACCOUNT_ERROR_NOT_FOUND]: [
    [
      'email',
      {
        type: 'manual',
        message: 'Email không chính xác hoặc chưa được đăng ký'
      }
    ]
  ],
  [ErrorCode.USER_ERROR_OTP_INVALID]: [
    [
      'otp',
      {
        type: 'manual',
        message: 'Mã OTP không hợp lệ hoặc đã hết hạn'
      }
    ]
  ],
  [ErrorCode.USER_ERROR_CONFIRM_PASSWORD_INVALID]: [
    [
      'confirmPassword',
      {
        type: 'manual',
        message: 'Mật khẩu nhập lại không chính xác'
      }
    ]
  ]
};

export const verifyOtpErrorMaps: ErrorMaps<VerifyOtpBodyType> = {
  [ErrorCode.USER_ERROR_OTP_INVALID]: [
    [
      'otp',
      {
        type: 'manual',
        message: 'Mã OTP không hợp lệ hoặc đã hết hạn'
      }
    ]
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
