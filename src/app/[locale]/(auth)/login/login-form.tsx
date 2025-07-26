'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Calculator, Calendar, Settings, Smile } from 'lucide-react';
import {
  AutoCompleteField,
  AvatarField,
  BooleanField,
  Breadcrumb,
  Button,
  CheckboxField,
  CheckboxGroupField,
  ColorPickerField,
  DatePickerField,
  DateRangePickerField,
  DateTimePickerField,
  InputField,
  RadioGroupField,
  TextAreaField,
  TimePickerField,
  Tooltip,
  UploadAvatarField
} from '@/components/form';
import { format, parse } from 'date-fns';
import { toast } from 'react-toastify';
import { logger } from '@/logger';

const formSchema = z.object({
  name: z.string().min(1),
  languages: z
    .array(z.string())
    .min(1, 'Language is required')
    .max(100, 'Language must be less than 100 characters'),
  boolean: z.boolean().optional(),
  check: z.boolean().optional(),
  fruits: z.array(z.string()).optional(),
  color: z.string().optional(),
  date: z.string().optional(),
  startTime: z.string().optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional()
    })
    .optional(),
  publishAt: z.date().optional(),
  avatar: z
    .object({
      blob: z.any(),
      preview: z.string()
    })
    .nullable()
    .optional(),
  gender: z.string().optional(),
  description: z.string().optional(),
  text: z.string().optional()
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '1',
      boolean: true,
      check: false,
      color: '#000000',
      languages: ['calculator'],
      fruits: [],
      date: format(new Date(), 'dd/MM/yyyy'),
      startTime: '00:00:00',
      dateRange: {
        from: new Date(),
        to: new Date()
      },
      publishAt: new Date(),
      gender: '0',
      text: 'Read only'
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log('Form submitted:', values);
      const rawDate = values.date;
      const parsed = parse(rawDate!, 'dd/MM/yyyy', new Date());
      const formattedDate = format(parsed, 'dd/MM/yyyy HH:mm:ss');
      const fromDate = values.dateRange?.from
        ? format(values.dateRange.from, 'dd/MM/yyyy')
        : undefined;
      const toDate = values.dateRange?.to
        ? format(values.dateRange.to, 'dd/MM/yyyy')
        : undefined;
      const publishAt = values.publishAt
        ? format(values.publishAt, 'dd/MM/yyyy HH:mm:ss')
        : undefined;
      logger.info(
        JSON.stringify(
          {
            ...values,
            date: formattedDate,
            dateRange: { from: fromDate, to: toDate },
            publishAt: publishAt
          },
          null,
          2
        )
      );
      toast(
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      logger.info('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }
  type ToolOption = {
    id: string;
    name: string;
    icon: React.ElementType;
    disabled?: boolean;
  };

  const tools: ToolOption[] = [
    { id: 'calendar', name: 'Calendar', icon: Calendar },
    { id: 'emoji', name: 'Search Emoji', icon: Smile },
    { id: 'calculator', name: 'Calculator', icon: Calculator, disabled: true },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const options = Array.from({ length: 10 }, (_, i) => ({
    label: `Fruit ${i + 1}`,
    value: `fruit-${i + 1}`
  }));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mx-auto max-w-3xl space-y-5 py-10'
      >
        {/* <InputField
          control={form.control}
          name='name'
          placeholder='OK'
          type='text'
          label='Name'
          required
          readOnly
        />
        <AutoCompleteField
          control={form.control}
          name='languages'
          options={tools}
          multiple
          label='Languages'
          placeholder='Select language'
          getLabel={(opt) => opt.name}
          getValue={(opt) => opt.id}
          getPrefix={(opt) => <opt.icon />}
          required
          allowClear
        />
        <AvatarField
          src='https://scontent-hkg1-1.xx.fbcdn.net/v/t39.30808-6/517117458_766725599044404_9074829272074341154_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=aEQBwonBckUQ7kNvwG6y3Fb&_nc_oc=AdkJhoVPyhZCcFgIXlL9SVJhbEwzGUd_TtaweJUkgETh7QhKDJ6QmsdO8tDCF6WgjrSwqIv64iJHijVqmcWmS6nz&_nc_zt=23&_nc_ht=scontent-hkg1-1.xx&_nc_gid=bgudVVL42USFZxK90zlkMQ&oh=00_AfQSYfdIJubcvX59HDlhRKREWwdK13CbU3TkzEQDameXzg&oe=687EF20D'
          size={80}
          zoomSize={256}
        />
        <DatePickerField
          control={form.control}
          name='date'
          label='Ngày phát hành'
          format='dd/MM/yyyy'
          description='Chọn thời gian đăng bài viết'
          placeholder='dd/MM/yyyy'
          required
          disabled
        />
        <TimePickerField
          control={form.control}
          name='startTime'
          label='Giờ bắt đầu'
          placeholder='HH:mm:ss'
          format='HH:mm:ss'
          required
          disabled
        />
        <Tooltip content='This is a tooltip'>
          <Button variant={'ghost'}>Hover me</Button>
        </Tooltip>
        <BooleanField
          control={form.control}
          name='boolean'
          label='OK bro?'
          required
        />
        <CheckboxField
          required
          control={form.control}
          name='check'
          label='OK'
          itemClassName='flex-row-reverse justify-end gap-2'
        />
        <CheckboxGroupField
          control={form.control}
          name='fruits'
          label='Select your favorite fruits'
          options={options}
          description='You can select multiple'
          required
        />
        <ColorPickerField
          control={form.control}
          name='color'
          label='Select color'
          required
        />
        <DateRangePickerField
          control={form.control}
          name='dateRange'
          label='Khoảng thời gian'
          description='Chọn thời gian diễn ra sự kiện'
          required
        />
        <DateTimePickerField
          control={form.control}
          name='publishAt'
          label='Ngày giờ phát hành'
          description='Chọn ngày giờ đăng bài viết'
          required
        />
        <UploadAvatarField
          control={form.control}
          name='avatar'
          label='Ảnh đại diện'
          required
        />
        <RadioGroupField
          control={form.control}
          name='gender'
          label='Gender'
          required
          options={[
            {
              label: 'Male',
              value: '0'
            },
            {
              label: 'Female',
              value: '1'
            }
          ]}
        />
        <TextAreaField
          control={form.control}
          name='text'
          label='Message'
          required
          className='focus'
          floatLabel
          maxLength={10}
          readOnly
        />
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Components', href: '/components' },
            { label: 'Breadcrumb' }
          ]}
        />
        <Button type='submit'>Submit</Button> */}
      </form>
    </Form>
  );
}
