'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';

type OtpFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  length?: number;
  required?: boolean;
  className?: string;
  formItemClassName?: string;
  containerClassName?: string;
  groupClassName?: string;
};

export default function OtpField<T extends FieldValues>({
  control,
  name,
  label,
  length = 6,
  required,
  className,
  formItemClassName,
  containerClassName,
  groupClassName
}: OtpFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn('flex flex-col items-center', formItemClassName)}
        >
          {label && (
            <FormLabel className='mb-2'>
              {label}
              {required && <span className='text-destructive'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <InputOTP
              maxLength={length}
              {...field}
              className={cn('flex justify-center', className)}
              containerClassName={cn('w-full', containerClassName)}
            >
              <InputOTPGroup
                className={cn('w-full justify-center gap-x-2', groupClassName)}
              >
                {Array.from({ length: length }).map((_, i) => (
                  <InputOTPSlot
                    className='text-md data-[active=true]:ring-green-primary h-12 w-12 rounded-md border-l data-[active=true]:border-none'
                    key={i}
                    index={i}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          <FormMessage className='mt-1' />
        </FormItem>
      )}
    />
  );
}
