import z from 'zod';

const profileSchema = z.object({
  id: z.coerce.number(),
  kind: z.coerce.number(),
  email: z.string().email(),
  fullName: z
    .string()
    .min(1, 'Họ tên không được để trống')
    .max(100, 'Họ tên không được quá 100 ký tự'),
  avatarPath: z.string().optional(),
  gender: z.coerce.number().optional()
});

const updateProfileSchema = z.object({
  avatarPath: z.string().optional(),
  email: z.string().email(),
  fullName: z
    .string()
    .min(1, 'Họ tên không được để trống')
    .max(100, 'Họ tên không được quá 100 ký tự'),
  gender: z.coerce.number().optional(),
  username: z
    .string()
    .min(1, 'Tên đăng nhập không được để trống')
    .max(50, 'Tên đăng nhập không được quá 50 ký tự')
    .optional(),
  phone: z.string().optional()
});

export { profileSchema, updateProfileSchema };
