'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/form';
import LoginForm from '@/components/app/auth/login/login-form';
import RegisterForm from '@/components/app/auth/register/register-form';
import { useDialogStore } from '@/store';
import { X } from 'lucide-react';

export default function AuthDialog() {
  const { open, setOpen, mode, setMode } = useDialogStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  const switchMode = (targetMode: 'login' | 'register') => {
    setOpen(false);
    setTimeout(() => {
      setMode(targetMode);
      setOpen(true);
    }, 300);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (overlayRef.current && e.target === overlayRef.current) {
      setOpen(false);
      setMode('login');
    }
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = 'auto';
      window.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <Button className='rounded-full' onClick={() => setOpen(true)}>
        Đăng nhập
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className='bg-background relative w-[440px] max-w-full overflow-hidden rounded-xl p-6 shadow-2xl'
            >
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setOpen(false)}
                className='absolute top-3 right-3 text-gray-500 hover:bg-transparent! hover:text-gray-300'
              >
                <X className='h-5! w-5!' />
              </Button>

              {/* ✅ Đây là phần quản lý login/register chuyển đổi */}
              <AnimatePresence mode='wait'>
                <motion.div key={mode}>
                  {mode === 'login' ? (
                    <LoginForm onSwitch={() => switchMode('register')} />
                  ) : (
                    <RegisterForm onSwitch={() => switchMode('login')} />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
