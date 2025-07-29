'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button, CheckboxField, InputField } from '@/components/form';
import PasswordField from '@/components/form/password-field';
import Link from 'next/link';
import ButtonLoginGoogle from '@/components/_app/auth/button-login-google';
import { registerSchema } from '@/schemaValidations';
import { RegisterType } from '@/types';

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const form = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      terms: false
    }
  });

  const onSubmit = (values: RegisterType) => {
    console.log('Đăng ký:', values);
    form.reset();
  };

  return (
    <>
      <div className='mb-5 flex flex-col items-center gap-2'>
        <h2 className='text-xl font-semibold'>Đăng ký</h2>
        <p className='text-muted-foreground text-center text-sm'>
          Đăng ký để bắt đầu sử dụng dịch vụ của chúng tôi.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
          <InputField
            control={form.control}
            name='email'
            label='Email'
            placeholder='Nhập email của bạn'
            required
          />
          <InputField
            control={form.control}
            name='fullName'
            label='Họ và tên'
            placeholder='Nhập họ và tên của bạn'
            required
          />
          <PasswordField
            control={form.control}
            name='password'
            label='Mật khẩu'
            placeholder='Nhập mật khẩu của bạn'
            required
          />
          <CheckboxField
            control={form.control}
            name='terms'
            label={
              <span>
                Tôi đồng ý với{' '}
                <Link href='/terms' className='text-primary underline'>
                  các điều khoản và điều kiện
                </Link>
              </span>
            }
          />
          <Button type='submit' className='w-full'>
            Đăng ký
          </Button>
        </form>
      </Form>

      <div className='my-4 flex items-center gap-3'>
        <div className='bg-border h-px flex-1' />
        <span className='text-muted-foreground text-sm'>Hoặc</span>
        <div className='bg-border h-px flex-1' />
      </div>

      <ButtonLoginGoogle />

      <div className='bg-accent mt-4 h-px w-full'></div>

      <div className='text-muted-foreground mt-1 text-center text-sm'>
        Đã có tài khoản?
        <Button
          type='button'
          variant='link'
          className='text-primary p-0 pl-1'
          onClick={onSwitch}
        >
          Đăng nhập ngay
        </Button>
      </div>
    </>
  );
}
