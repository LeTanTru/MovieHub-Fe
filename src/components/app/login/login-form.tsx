'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button, CheckboxField, InputField } from '@/components/form';
import Link from 'next/link';
import { googleIcon, logo } from '@/assets';
import Image from 'next/image';

const formSchema = z.object({
  email: z
    .string()
    .nonempty('Bắt buộc phải nhập email')
    .email('Email không hợp lệ'),
  password: z.string().nonempty('Bắt buộc'),
  rememberMe: z.boolean().optional()
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='default'
          className={`hover:bg-primary/90 rounded-full transition-all duration-200 ease-linear`}
        >
          Đăng nhập
        </Button>
      </DialogTrigger>
      <DialogContent
        suppressHydrationWarning
        className='data-[state=open]:slide-in-from-top-16! data-[state=closed]:slide-out-to-top-16! data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100 [&>button[data-slot=dialog-close]] w-100 border-none [&>button[data-slot=dialog-close]]:cursor-pointer [&>button[data-slot=dialog-close]]:focus:ring-0 [&>button[data-slot=dialog-close]]:focus:outline-none'
      >
        <div className='flex flex-col items-center gap-2'>
          <div
            className='flex size-15 shrink-0 items-center justify-center rounded-full'
            aria-hidden='true'
          >
            <Image
              src={logo}
              width={100}
              height={100}
              alt='Logo'
              className='rounded-full'
            />
          </div>
          <DialogHeader>
            <DialogTitle className='sm:text-center'>Đăng nhập</DialogTitle>
            <DialogDescription className='sm:text-center'>
              Đăng nhập để có trải nghiệm tốt nhất với MovieHub
            </DialogDescription>
          </DialogHeader>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mx-auto w-full space-y-5'
          >
            <div className='space-y-4'>
              <div className='*:not-first:mt-2'>
                <InputField
                  control={form.control}
                  name='email'
                  placeholder='Nhập email của bạn'
                  type='text'
                  label='Email'
                  required
                  readOnly
                />
              </div>
              <div className='*:not-first:mt-2'>
                <InputField
                  control={form.control}
                  name='password'
                  placeholder='Nhập mật khẩu của bạn'
                  type='password'
                  label='Mật khẩu'
                  required
                  readOnly
                />
              </div>
            </div>
            <div className='flex justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <CheckboxField
                  required
                  control={form.control}
                  name='rememberMe'
                  label='Ghi nhớ đăng nhập'
                />
              </div>
              <Link className='text-sm underline hover:no-underline' href='#'>
                Quên mật khẩu?
              </Link>
            </div>
            <Button type='button' className='w-full'>
              Đăng nhập
            </Button>
          </form>
        </Form>
        <div className='before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1'>
          <span className='text-muted-foreground text-xs'>Or</span>
        </div>
        <Button variant='secondary'>
          <Image src={googleIcon} alt='Google Icon' width={20} height={20} />
          Đăng nhập với Google
        </Button>
        <div className='before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1'></div>
        <div className='text-muted-foreground text-center text-sm'>
          Chưa có tài khoản?
          <Button variant='link' className='text-primary px-1 hover:underline'>
            Đăng ký ngay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
