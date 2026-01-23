'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/form';
import { X } from 'lucide-react';
import { useAuthDialogStore } from '@/store';
import { LoginForm } from '@/components/app/auth/login';
import { RegisterForm } from '@/components/app/auth/register';
import { AuthType } from '@/types';
import { cn } from '@/lib';
import { AUTH_DIALOG_DELAY } from '@/constants';

export default function AuthDialog() {
  const { mode, open, isSubmitting, setMode, setOpen } = useAuthDialogStore();

  const switchMode = (targetMode: AuthType) => {
    setOpen(false);
    setTimeout(() => {
      setMode(targetMode);
      setOpen(true);
    }, AUTH_DIALOG_DELAY);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setOpen(false);
  };

  return (
    <>
      <Button className='w-full rounded-full' onClick={() => setOpen(true)}>
        Đăng nhập
      </Button>

      <AnimatePresence mode='wait'>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed inset-0 z-9999 flex items-center justify-center bg-black/50',
              { 'cursor-wait': isSubmitting }
            )}
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className='bg-background relative w-120 max-w-full overflow-hidden rounded-xl p-6 shadow-2xl'
            >
              <Button
                variant='ghost'
                size='icon'
                onClick={handleClose}
                className='absolute top-3 right-3 text-gray-500 hover:bg-transparent! hover:text-gray-300'
              >
                <X className='size-5!' />
              </Button>

              {mode === 'login' ? (
                <LoginForm onSwitch={() => switchMode('register')} />
              ) : (
                <RegisterForm onSwitch={() => switchMode('login')} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
