'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/form';
import LoginForm from '@/components/app/auth/login/login-form';
import RegisterForm from '@/components/app/auth/register/register-form';
import { X } from 'lucide-react';
import useAuthDialogStore from '@/store/use-auth-dialog-store';

export default function AuthDialog() {
  const authDialogStore = useAuthDialogStore();

  const switchMode = (targetMode: 'login' | 'register') => {
    authDialogStore.setOpen(false);
    setTimeout(() => {
      authDialogStore.setMode(targetMode);
      authDialogStore.setOpen(true);
    }, 300);
  };

  return (
    <>
      <Button
        className='w-full rounded-full'
        onClick={() => authDialogStore.setOpen(true)}
      >
        Đăng nhập
      </Button>

      <AnimatePresence>
        {authDialogStore.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='fixed inset-0 z-9999 flex items-center justify-center bg-black/50'
            onClick={() => authDialogStore.setOpen(false)}
          >
            <motion.div
              key='modal-content'
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className='bg-background relative w-[440px] max-w-full overflow-hidden rounded-xl p-6 shadow-2xl'
            >
              <Button
                variant='ghost'
                size='icon'
                onClick={() => authDialogStore.setOpen(false)}
                className='absolute top-3 right-3 text-gray-500 hover:bg-transparent! hover:text-gray-300'
              >
                <X className='size-5!' />
              </Button>

              {authDialogStore.mode === 'login' ? (
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
