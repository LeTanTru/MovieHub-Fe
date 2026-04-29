'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/form';
import { cn } from '@/lib';
import { Info } from 'lucide-react';
import { MouseEvent, useState } from 'react';
import { CircleLoading } from '@/components/loading';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  trigger?: React.ReactNode;
  className?: string;
  // Controlled mode
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
          {trigger}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-0! data-[state=closed]:slide-out-to-top-0! data-[state=open]:slide-in-from-left-0! data-[state=open]:slide-in-from-top-0! bg-charade top-[30%] w-fit max-w-lg gap-0 border-none p-4',
          className
        )}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2 text-sm font-normal'>
            <Info className='size-6 fill-orange-500 stroke-gray-300' />
            {message}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className='mt-2'>
          <AlertDialogCancel asChild onClick={handleCancel}>
            <Button
              variant='outline'
              className='h-8 cursor-pointer border-rose-500 bg-transparent font-normal text-rose-500 transition-all duration-200 ease-linear hover:border-rose-500/80 hover:bg-transparent hover:text-rose-500/80 dark:hover:bg-transparent'
            >
              {cancelText}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={cn(
              'bg-golden-glow hover:bg-golden-glow/80 h-8 cursor-pointer font-normal transition-all duration-200 ease-linear',
              {
                'bg-golden-glow/50 hover:bg-golden-glow/50 pointer-events-none cursor-not-allowed':
                  loading
              }
            )}
          >
            {loading ? <CircleLoading className='size-4' /> : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
