'use client';

import { ReactNode, useRef, useState, useEffect } from 'react';
import { AnimatePresence, HTMLMotionProps, m } from 'framer-motion';
import { cn } from '@/lib';
import { createPortal } from 'react-dom';
import { useIsMounted } from '@/hooks';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/form';
import { Activity } from '@/components/activity';
import { isMobileDevice } from '@/utils';

type ModalProps = Omit<HTMLMotionProps<'div'>, 'title'> & {
  children: ReactNode;
  open: boolean;
  onClose?: () => void;
  backdrop?: boolean;
  title?: string | ReactNode;
  showClose?: boolean;
  confirmOnClose?: boolean;
  confirmOnCloseMessage?: string;
  variants?: {
    initial: Record<string, any>;
    animate: Record<string, any>;
    exit: Record<string, any>;
  };
  headerClassName?: string;
  bodyClassName?: string;
  bodyRef?: React.RefObject<HTMLDivElement | null>;
  bodyStyle?: React.CSSProperties;
  scrollable?: boolean;
  bodyWrapperClassName?: string;
  confirmClassName?: string;
};

export default function Modal({
  children,
  open,
  onClose,
  backdrop = true,
  className,
  title,
  showClose = true,
  confirmOnClose = false,
  confirmOnCloseMessage = 'Bạn có chắc chắn muốn hủy không ?',
  variants = {
    initial: { opacity: 0.5, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0.5, scale: 0.85 }
  },
  headerClassName,
  bodyClassName,
  bodyRef,
  bodyStyle,
  scrollable = false,
  bodyWrapperClassName,
  confirmClassName,
  ...rest
}: ModalProps) {
  const isMounted = useIsMounted();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!scrollable) return;

    const checkOverflow = () => {
      if (scrollRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
        const hasOverflow = scrollHeight > clientHeight;
        const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;
        setShowScrollArrow(hasOverflow && !isAtBottom);
      }
    };

    checkOverflow();
    const scrollElement = scrollRef.current;
    scrollElement?.addEventListener('scroll', checkOverflow, { passive: true });
    window.addEventListener('resize', checkOverflow);

    return () => {
      scrollElement?.removeEventListener('scroll', checkOverflow);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [open, children, scrollable]);

  useEffect(() => {
    if (!open) return;

    if (isMobileDevice()) document.body.classList.add('body-lock', 'mobile');
    else document.body.classList.add('body-lock');
    return () => {
      document.body.classList.remove('body-lock');
      document.body.classList.remove('body-lock', 'mobile');
    };
  }, [open]);

  // Reset confirmation dialog when modal closes
  useEffect(() => {
    if (!open) setShowConfirm(false);
  }, [open]);

  const handleScrollDown = () => {
    scrollRef.current?.scrollBy({ top: 200, behavior: 'smooth' });
  };

  const handleCloseRequest = () => {
    if (confirmOnClose) {
      setShowConfirm(true);
    } else {
      onClose?.();
    }
  };

  const handleConfirmYes = () => {
    setShowConfirm(false);
    onClose?.();
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
  };

  if (!isMounted) return;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {backdrop && (
            <m.div
              className='backdrop fixed inset-0 z-20 bg-black/50 backdrop-blur-xs'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          )}
          <m.div
            className={cn(
              'fixed inset-0 z-50 flex items-center justify-center',
              className
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, ease: 'linear' }}
            onClick={handleCloseRequest}
            onMouseDown={(e) => e.stopPropagation()}
            {...rest}
          >
            <m.div
              className={cn(
                'body-wrapper absolute top-1/2 left-1/2 w-250 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-[0px_0px_10px_2px] shadow-black/40',
                bodyWrapperClassName
              )}
              initial={variants.initial}
              animate={variants.animate}
              exit={variants.exit}
              transition={{ duration: 0.15, ease: 'linear' }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Activity visible={!!title || !!showClose}>
                <div
                  className={cn(
                    'header-title flex h-10 items-center justify-between border-none text-white',
                    headerClassName
                  )}
                >
                  <div className='font-semibold text-gray-800 text-white'>
                    {title}
                  </div>

                  <Activity visible={showClose && onClose !== undefined}>
                    <Button
                      className='text-gray-400 hover:bg-transparent hover:text-black'
                      onClick={handleCloseRequest}
                      variant='ghost'
                    >
                      <X className='size-5' />
                    </Button>
                  </Activity>
                </div>
              </Activity>

              <div ref={bodyRef} className='body relative h-[calc(100%-40px)]'>
                <div
                  ref={scrollRef}
                  className={cn(
                    'scrollbar-none h-full rounded-br-lg rounded-bl-lg',
                    { 'overflow-auto': scrollable },
                    bodyClassName
                  )}
                  style={bodyStyle}
                >
                  {children}
                </div>

                <AnimatePresence>
                  {scrollable && showScrollArrow && (
                    <m.button
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onClick={handleScrollDown}
                      className='absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce rounded-full p-2 text-white shadow-[0px_0px_10px_2px] shadow-gray-300 transition-all'
                      aria-label='Scroll down'
                    >
                      <ChevronDown className='size-5 text-slate-800' />
                    </m.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirmation overlay */}
              <AnimatePresence>
                {showConfirm && (
                  <m.div
                    className='absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/40'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'linear' }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <m.div
                      className={cn(
                        'flex flex-col items-center gap-4 rounded-lg bg-white px-6 py-5 shadow-lg dark:bg-gray-800',
                        confirmClassName
                      )}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      transition={{ duration: 0.05, ease: 'linear' }}
                    >
                      <p className='text-center text-gray-200'>
                        {confirmOnCloseMessage}
                      </p>
                      <div className='flex gap-3'>
                        <Button
                          variant='outline'
                          className='border-red-500 hover:border-red-500/80 hover:bg-transparent hover:text-red-500/80'
                          onClick={handleConfirmNo}
                        >
                          Không
                        </Button>
                        <Button
                          className='bg-primary-button hover:bg-primary-button/80'
                          onClick={handleConfirmYes}
                        >
                          Có
                        </Button>
                      </div>
                    </m.div>
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>
          </m.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
