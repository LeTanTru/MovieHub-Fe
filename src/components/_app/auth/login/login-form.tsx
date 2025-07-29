'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button, CheckboxField, InputField } from '@/components/form';
import Link from 'next/link';
import ButtonLoginGoogle from '@/components/_app/auth/button-login-google';
import PasswordField from '@/components/form/password-field';
import { LoginType } from '@/types';
import { loginSchema } from '@/schemaValidations';

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = (values: LoginType) => {
    // handle login logic
  };

  return (
    <>
      <div className='mb-5 flex flex-col items-center gap-2'>
        <h2 className='text-xl font-semibold'>Đăng nhập</h2>
        <p className='text-muted-foreground text-center text-sm'>
          Đăng nhập để có trải nghiệm tốt nhất với MovieHub
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
          <InputField
            control={form.control}
            name='email'
            label='Email'
            placeholder='Nhập email của bạn'
            type='text'
            required
          />
          <PasswordField
            control={form.control}
            name='password'
            label='Mật khẩu'
            placeholder='Nhập mật khẩu của bạn'
            type='password'
            required
          />

          <div className='flex items-center justify-between text-sm'>
            <CheckboxField
              control={form.control}
              name='rememberMe'
              label='Ghi nhớ đăng nhập'
            />
            <Link href='#' className='underline hover:no-underline'>
              Quên mật khẩu?
            </Link>
          </div>

          <Button type='submit' className='w-full'>
            Đăng nhập
          </Button>
        </form>
      </Form>

      <div className='my-4 flex items-center gap-3'>
        <div className='bg-border h-px flex-1'></div>
        <span className='text-muted-foreground text-sm'>Hoặc</span>
        <div className='bg-border h-px flex-1'></div>
      </div>

      <ButtonLoginGoogle />

      <div className='bg-accent mt-4 h-px w-full'></div>

      <div className='text-muted-foreground mt-1 text-center text-sm'>
        Chưa có tài khoản?
        <Button
          type='button'
          variant='link'
          className='text-primary p-0 pl-1'
          onClick={onSwitch}
        >
          Đăng ký ngay
        </Button>
      </div>
    </>
  );
}
