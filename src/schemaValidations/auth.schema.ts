import z from 'zod';

const loginSchema = z.object({
  email: z.string().nonempty('Bắt buộc').email('Email không hợp lệ'),
  password: z.string().nonempty('Bắt buộc')
});

const registerSchema = z.object({
  email: z
    .string()
    .nonempty('Bắt buộc phải nhập email')
    .email('Email không hợp lệ'),
  fullName: z.string().nonempty('Bắt buộc'),
  password: z
    .string()
    .nonempty('Bắt buộc')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
      message:
        'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số'
    }),
  terms: z.boolean().refine((val) => val === true, {
    message: 'Bạn phải đồng ý với điều khoản'
  })
});

export { loginSchema, registerSchema };
