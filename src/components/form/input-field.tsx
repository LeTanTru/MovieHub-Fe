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
  readOnly = false
}: InputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            { 'cursor-not-allowed opacity-50': disabled },
            formItemClassName
          )}
        >
          {label && (
            <FormLabel className={cn('ml-1 gap-1.5', labelClassName)}>
              {label}
              {required && <span className='text-red-500'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              disabled={disabled}
              readOnly={readOnly}
              {...field}
              className={cn(className, 'focus-visible:ring-[1px]', {
                'cursor-not-allowed opacity-50': disabled
              })}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className={'mb-0 ml-1'} />
        </FormItem>
      )}
    />
  );
}
