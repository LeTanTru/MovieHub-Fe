import { z } from 'zod';

export const updateProfileSchema = z.object({
  id: z.string(),
  avatarPath: z.string().optional(),
  email: z
    .string()
    .nonempty({ error: 'Email không được để trống' })
    .trim()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ'),
  fullName: z
    .string()
    .nonempty({ error: 'Họ tên không được để trống' })
    .trim()
    .min(1, 'Họ tên không được để trống')
    .max(100, 'Họ tên không được quá 100 ký tự'),
  gender: z.number(),
  username: z
    .string({ error: 'Username không được để trống' })
    .trim()
    .min(1, 'Tên đăng nhập không được để trống')
    .max(50, 'Tên đăng nhập không được quá 50 ký tự'),
  phone: z
    .string()
    .nonempty('Số điện thoại không được để trống')
    .regex(/^\d{10}$/, 'Số điện thoại phải gồm 10 chữ số')
    .regex(
      /^0[35789][0-9]{8}$/,
      'Số điện thoại phải bắt đầu bằng 03, 05, 07, 08 hoặc 09'
    )
});
