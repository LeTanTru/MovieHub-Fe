import {
  RegisterType,
  ForgotPasswordBodyType,
  VerifyOtpBodyType
} from '@/types';
import { ErrorMaps } from '@/types/form-error.type';
import { ErrorCode } from './error-code';

export const registerErrorMaps: ErrorMaps<RegisterType> = {
  [ErrorCode.USER_ERROR_NOT_FOUND]: [
    ['email', { type: 'manual', message: 'Email không tồn tại' }]
  ],
  [ErrorCode.USER_ERROR_EMAIL_EXISTED]: [
    ['email', { type: 'manual', message: 'Email đã tồn tại' }]
  ]
};

export const forgotPasswordErrorMaps: ErrorMaps<ForgotPasswordBodyType> = {
  [ErrorCode.USER_ERROR_NOT_FOUND]: [
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
