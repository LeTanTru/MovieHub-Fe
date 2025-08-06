'use client';
import { Control } from 'react-hook-form';
import { format, Locale, parse } from 'date-fns';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/form';

type Props = {
  control: Control<any>;
  name: string;
  label?: string;
  description?: string;
  className?: string;
  format?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  labelClassName?: string;
};

export default function DatePickerField({
  control,
  name,
  label,
  description,
  className,
  format: dateFormat = 'yyyy-MM-dd',
  disabled,
  required,
  placeholder,
  labelClassName
}: Props) {
  const calendarLocale: Locale = vi;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const parsedValue =
          typeof field.value === 'string'
            ? parse(field.value, dateFormat, new Date())
            : field.value;

        return (
          <FormItem
            className={cn(className, {
              'cursor-not-allowed opacity-50': disabled
            })}
          >
            {label && (
              <FormLabel className={cn('ml-1 gap-1.5', labelClassName)}>
                {label}
                {required && <span className='text-destructive'>*</span>}
              </FormLabel>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant='outline'
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                    disabled={disabled}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {field.value
                      ? format(parsedValue, dateFormat)
                      : placeholder}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-auto space-y-2 p-4' align='start'>
                <Calendar
                  locale={calendarLocale}
                  mode='single'
                  selected={parsedValue}
                  onSelect={(date) => {
                    if (!date) return;
                    const withTime = parsedValue || new Date();
                    withTime.setFullYear(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate()
                    );
                    field.onChange(format(withTime, dateFormat));
                  }}
                />
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage className={'mb-0 ml-1'} />
          </FormItem>
        );
      }}
    />
  );
}
