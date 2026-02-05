import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().nonempty('Bắt buộc').email('Email không hợp lệ'),
  password: z.string().nonempty('Bắt buộc')
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .nonempty('Bắt buộc phải nhập email')
      .email('Email không hợp lệ'),
    fullName: z.string().nonempty('Bắt buộc'),
    password: z
      .string()
      .nonempty('Bắt buộc')
      .min(8, 'Mật khẩu tối thiểu 8 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Phải có ít nhất 1 chữ số')
      .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z.string().nonempty('Bắt buộc'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'Bạn phải đồng ý với điều khoản'
    })
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Mật khẩu nhập lại không khớp',
        path: ['confirmPassword']
      });
    }
  });

export const otpSchema = z.object({
  email: z.string().email().nonempty(),
  otp: z
    .string()
    .nonempty('Bắt buộc')
    .min(6, 'OTP phải có đủ 6 ký tự')
    .max(6, 'OTP phải có đủ 6 ký tự')
});

export const forgotPasswordStep1Schema = z.object({
  email: z
    .string()
    .nonempty('Bắt buộc')
    .email('Email không chính xác hoặc chưa được đăng ký')
});

export const forgotPasswordStep2Schema = z
  .object({
    otp: z
      .string()
      .nonempty('Bắt buộc')
      .length(6, { error: 'OTP phải có đủ 6 ký tự' }),
    password: z
      .string()
      .nonempty('Bắt buộc')
      .min(8, 'Mật khẩu tối thiểu 8 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Phải có ít nhất 1 chữ số')
      .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z.string().nonempty('Bắt buộc')
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Mật khẩu nhập lại không khớp',
        path: ['confirmPassword']
      });
    }
  });

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().nonempty('Bắt buộc'),
    newPassword: z
      .string()
      .nonempty('Bắt buộc')
      .min(8, 'Mật khẩu tối thiểu 8 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Phải có ít nhất 1 chữ số')
      .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
    confirmNewPassword: z.string().nonempty('Bắt buộc')
  })
  .superRefine((data, ctx) => {
    if (data.confirmNewPassword !== data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Mật khẩu nhập lại không khớp',
        path: ['confirmNewPassword']
      });
    }
  });
