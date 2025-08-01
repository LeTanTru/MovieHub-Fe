'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button, CheckboxField, InputField } from '@/components/form';
import PasswordField from '@/components/form/password-field';
import Link from 'next/link';
import { registerSchema } from '@/schemaValidations';
import { RegisterType } from '@/types';
import { logger } from '@/logger';
import { useRegisterMutation } from '@/queries/use-auth';
import { registerErrorMaps } from '@/constants';
import { Loader2 } from 'lucide-react';
import { applyFormErrors, notify } from '@/utils';
import { useDialogStore } from '@/store';

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const { setOpen, setMode } = useDialogStore();
  const form = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      terms: false
    }
  });
  const registerMutation = useRegisterMutation();

  const onSubmit = async (values: RegisterType) => {
    try {
      const response = await registerMutation.mutateAsync(values);
      if (!response?.result && response.code) {
        applyFormErrors(form, response.code, registerErrorMaps);
      } else {
        notify.success('Đăng ký thành công');
        setOpen(false);
        setTimeout(() => {
          setOpen(true);
          setMode('login');
        }, 300);
      }
    } catch (error) {
      logger.error('Error during registration:', error);
    }
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
            {registerMutation.isPending ? (
              <Loader2 className='h-6! w-6! animate-spin' />
            ) : (
              'Đăng ký'
            )}
          </Button>
        </form>
      </Form>

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
