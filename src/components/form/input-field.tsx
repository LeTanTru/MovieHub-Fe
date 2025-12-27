'use client';

import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  type?: string;
  className?: string;
  formItemClassName?: string;
  required?: boolean;
  labelClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
};

export default function InputField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  type = 'text',
  className,
  formItemClassName,
  required,
  labelClassName,
  disabled,
  readOnly = false,
  prefixIcon,
  suffixIcon
}: InputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(
            { 'cursor-not-allowed opacity-50': disabled },
            formItemClassName
          )}
        >
          {label && (
            <FormLabel className={cn('ml-1 gap-1.5', labelClassName)}>
              {label}
              {required && <span className='text-destructive'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className='relative'>
              {prefixIcon && (
                <div className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2'>
                  {prefixIcon}
                </div>
              )}
              <Input
                placeholder={placeholder}
                type={type}
                disabled={disabled}
                readOnly={readOnly}
                {...field}
                className={cn(
                  className,
                  'pt-0! pb-0.5 placeholder:text-gray-300 focus-visible:ring-[1px]',
                  {
                    'pl-10': prefixIcon,
                    'pr-10': suffixIcon,
                    'cursor-not-allowed opacity-50': disabled,
                    'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400':
                      fieldState.error
                  }
                )}
              />
              {suffixIcon && (
                <div className='text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2'>
                  {suffixIcon}
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className={'mb-0 ml-1'} />
        </FormItem>
      )}
    />
  );
}
