import z from 'zod';

const profileSchema = z.object({
  id: z.number(),
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
    .string({ error: 'Số điện thoại không được để trống' })
    .trim()
    .regex(/^\d{10}$/, 'Số điện thoại không hợp lệ')
});

const updateProfileSchema = profileSchema;

export { profileSchema, updateProfileSchema };
