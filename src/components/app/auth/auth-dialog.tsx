'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/form';
import LoginForm from '@/components/app/auth/login/login-form';
import RegisterForm from '@/components/app/auth/register/register-form';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useDialogStore } from '@/store';

export default function AuthDialog() {
  const { open, setOpen, mode, setMode } = useDialogStore();

  const switchMode = (targetMode: 'login' | 'register') => {
    setOpen(false);
    setTimeout(() => {
      setMode(targetMode);
      setOpen(true);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className='flex gap-4'>
        <DialogTrigger asChild>
          <Button
            className='rounded-full'
            onClick={() => {
              setOpen(true);
            }}
          >
            Đăng nhập
          </Button>
        </DialogTrigger>
      </div>

      <DialogHeader>
        <VisuallyHidden>
          <DialogTitle>
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </DialogTitle>
        </VisuallyHidden>
      </DialogHeader>

      <DialogContent className='data-[state=open]:slide-in-from-top-16! data-[state=closed]:slide-out-to-top-16! data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100 [&>button[data-slot=dialog-close]] w-110 border-none [&>button[data-slot=dialog-close]]:cursor-pointer [&>button[data-slot=dialog-close]]:focus:ring-0 [&>button[data-slot=dialog-close]]:focus:outline-none'>
        <AnimatePresence mode='wait' initial={false}>
          {mode === 'login' ? (
            <motion.div
              key='login'
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <LoginForm onSwitch={() => switchMode('register')} />
            </motion.div>
          ) : (
            <motion.div
              key='register'
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <RegisterForm onSwitch={() => switchMode('login')} />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
