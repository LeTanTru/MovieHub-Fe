import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';

type AsyncDefaultValues<T> = (payload?: unknown) => Promise<T>;

type BaseFormProps<T extends Record<string, any>> = {
  schema: any;
  defaultValues: DefaultValues<T> | AsyncDefaultValues<T>;
  onSubmit: (values: T) => Promise<void> | void;
  children?: (methods: ReturnType<typeof useForm<T>>) => React.ReactNode;
  className?: string;
  initialValues?: T;
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all' | undefined;
  onChange?: () => void;
};

export default function BaseForm<T extends Record<string, any>>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
  initialValues,
  mode = 'onChange',
  onChange
}: BaseFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  return (
    <Form {...form}>
      <form
        className={className}
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={onChange}
      >
        {children?.(form)}
      </form>
    </Form>
  );
}
