'use client';

import { useId, useState } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';

type TextAreaFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  floatLabel?: boolean;
  maxLength?: number;
};

export default function TextAreaField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = ' ',
  className,
  required = false,
  disabled = false,
  readOnly = false,
  floatLabel = false,
  maxLength
}: TextAreaFieldProps<T>) {
  const id = useId();
  const [charCount, setCharCount] = useState(0);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className={cn('relative', floatLabel && 'group')}>
            {label && (
              <FormLabel
                htmlFor={id}
                className={cn('ml-1 gap-2', {
                  'origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+textarea:not(:placeholder-shown)]:text-foreground has-aria-invalid:border-destructive/60 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive bg-background absolute top-0 block translate-y-2 cursor-text rounded px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:-translate-y-1/2 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+textarea:not(:placeholder-shown)]:pointer-events-none has-[+textarea:not(:placeholder-shown)]:-translate-y-1/2 has-[+textarea:not(:placeholder-shown)]:cursor-default has-[+textarea:not(:placeholder-shown)]:text-xs has-[+textarea:not(:placeholder-shown)]:font-medium':
                    floatLabel
                })}
              >
                <span className='px-1'>{label}</span>
                {required && <span className='text-destructive ml-1'>*</span>}
              </FormLabel>
            )}

            <FormControl>
              <Textarea
                id={id}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                maxLength={maxLength}
                className={cn(floatLabel && 'bg-background pt-6', className)}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setCharCount(e.target.value.length);
                }}
              />
            </FormControl>

            {maxLength !== undefined && (
              <div className='text-muted-foreground mt-1 text-right text-xs'>
                {maxLength - charCount} còn lại
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
