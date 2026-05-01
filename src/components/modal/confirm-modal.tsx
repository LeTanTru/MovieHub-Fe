'use client';

import { MouseEvent, useState } from 'react';
import { Info } from 'lucide-react';
import Modal from './modal';
import { CircleLoading } from '@/components/loading';
import { Button } from '@/components/form';
import { cn } from '@/lib';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  trigger?: React.ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
}

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
  confirmText = 'Có',
  cancelText = 'Không',
  trigger,
  className,
  open: controlledOpen,
  onOpenChange,
  loading
}: ConfirmModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (v: boolean) => onOpenChange?.(v)
    : setInternalOpen;

  const handleConfirm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirm();
    setOpen(false);
  };

  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel?.();
    setOpen(false);
  };

  return (
    <>
      {trigger && (
        <div
          role='button'
          tabIndex={0}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          {trigger}
        </div>
      )}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className={cn(
          'max-1536:top-50 max-1024:top-30 top-70 w-fit max-w-lg min-w-xs p-4',
          className
        )}
      >
        <Modal.Body className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <Info className='size-6 fill-orange-500 stroke-gray-300' />
            {message}
          </div>
          <div className='flex justify-end gap-2'>
            <Button
              variant='outline'
              className='h-8 cursor-pointer border-rose-500 bg-transparent font-normal text-rose-500 transition-all duration-200 ease-linear hover:border-rose-500/80 hover:bg-transparent hover:text-rose-500/80 dark:hover:bg-transparent'
              onClick={handleCancel}
            >
              {cancelText}
            </Button>
            <Button
              className={cn(
                'bg-golden-glow hover:bg-golden-glow/80 h-8 cursor-pointer font-normal transition-all duration-200 ease-linear',
                {
                  'bg-golden-glow/50 hover:bg-golden-glow/50 pointer-events-none cursor-not-allowed':
                    loading
                }
              )}
              onClick={handleConfirm}
            >
              {loading ? <CircleLoading className='size-4' /> : confirmText}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
