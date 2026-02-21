'use client';

import { ReactNode, useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib';
import { createPortal } from 'react-dom';
import { useIsMounted } from '@/hooks';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/form';
import { Activity } from '@/components/activity';

export type ModalProps = Omit<HTMLMotionProps<'div'>, 'title'> & {
  children: ReactNode;
  open: boolean;
  onClose?: () => void;
  backdrop?: boolean;
  closeOnBackdropClick?: boolean;
  title?: string | ReactNode;
  showClose?: boolean;
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
};

export default function Modal({
  children,
  open,
  onClose,
  backdrop = true,
  closeOnBackdropClick = false,
  className,
  title,
  showClose = true,
  variants = {
    initial: {
      y: -100,
      opacity: 0,
      scale: 0.95
    },
    animate: { y: 0, opacity: 1, scale: 1 },
    exit: { y: -100, opacity: 0, scale: 0.95 }
  },
  headerClassName,
  bodyClassName,
  bodyRef,
  bodyStyle,
  scrollable = false,
  bodyWrapperClassName,
  ...rest
}: ModalProps) {
  const isMounted = useIsMounted();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollArrow, setShowScrollArrow] = useState<boolean>(false);

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
    scrollElement?.addEventListener('scroll', checkOverflow);
    window.addEventListener('resize', checkOverflow);

    return () => {
      scrollElement?.removeEventListener('scroll', checkOverflow);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [open, children, scrollable]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!open) return;

    document.body.classList.add('body-lock');

    return () => {
      document.body.classList.remove('body-lock');
    };
  }, [open]);

  const handleScrollDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: 200, behavior: 'smooth' });
    }
  };

  if (!isMounted) return;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className={cn(
            'fixed inset-0 z-20 flex items-center justify-center',
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          {...rest}
        >
          <Activity visible={backdrop}>
            <motion.div
              className='backdrop absolute inset-0 bg-black/50'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeOnBackdropClick ? onClose : undefined}
            />
          </Activity>

          <motion.div
            className={cn(
              'body-wrapper absolute top-1/2 left-1/2 h-[80vh] min-h-[80vh] w-300 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-[0px_0px_10px_2px] shadow-black/40',
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
                  'header-title flex items-center justify-between border-none py-2 pr-2 pl-4',
                  headerClassName
                )}
              >
                <div className='font-semibold text-white'>{title}</div>

                <Activity visible={showClose && onClose !== undefined}>
                  <Button
                    className='h-fit! p-0! text-white transition hover:bg-transparent hover:text-gray-400'
                    onClick={onClose}
                    variant='ghost'
                  >
                    <X className='size-5' />
                  </Button>
                </Activity>
              </div>
            </Activity>

            <div ref={bodyRef} className='body relative h-full'>
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
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={handleScrollDown}
                    className='absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce rounded-full p-2 text-white shadow-[0px_0px_10px_2px] shadow-gray-300 transition'
                    aria-label='Scroll down'
                  >
                    <ChevronDown className='size-5 text-slate-800' />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
