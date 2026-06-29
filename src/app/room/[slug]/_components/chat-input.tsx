'use client';

import { TelegramIcon } from '@/assets';
import { Button, TextAreaField } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { useAuth, useClickAnimation } from '@/hooks';
import { chatSchema } from '@/schemaValidations';
import { ChatBodyType } from '@/types';
import { FaLaugh } from 'react-icons/fa';

export default function ChatInput() {
  const { profile } = useAuth();

  const { iconRef, startAnimation } = useClickAnimation();

  const handleSendMessage = () => {
    startAnimation();
  };

  const defaultValues: ChatBodyType = {
    accountId: profile?.id || '',
    content: '',
    author: {
      fullName: profile?.fullName || '',
      id: profile?.id || '',
      avatarPath: profile?.avatarPath || null,
      username: profile?.username || null
    },
    createDate: ''
  };

  const onSubmit = (values: ChatBodyType) => {};

  return (
    <BaseForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      schema={chatSchema}
      className='rounded-md bg-transparent p-0'
    >
      {(form) => (
        <div className='relative flex gap-2'>
          <FaLaugh className='absolute top-1/2 left-2 z-9 -translate-y-1/2 text-[20px] text-gray-400' />
          <TextAreaField
            control={form.control}
            name='content'
            formItemClassName='w-full rounded-md bg-white'
            className='min-h-9 rounded-md bg-gray-100 py-2 pl-8 text-black placeholder:text-gray-400 focus-visible:ring-transparent!'
            placeholder='Chat gì đó...'
            rows={1}
            maxRows={4}
          />
          <Button
            className='bg-golden-glow hover:bg-golden-glow/80 px-3 text-black'
            onClick={handleSendMessage}
          >
            <TelegramIcon ref={iconRef} />
          </Button>
        </div>
      )}
    </BaseForm>
  );
}
