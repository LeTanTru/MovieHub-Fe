'use client';

import { TelegramIcon } from '@/assets';
import { Button, TextAreaField } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { mqttCMDs, mqttTopics } from '@/constants';
import { useAuth, useClickAnimation } from '@/hooks';
import { getMqttClient } from '@/lib/mqtt';
import { logger } from '@/logger';
import { chatSchema } from '@/schemaValidations';
import { useRoomStore } from '@/store';
import { ChatBodyType } from '@/types';
import type { UseFormReturn } from 'react-hook-form';
import { generateMqttTopic, notify, publishMqttMessage } from '@/utils';
import { FaLaugh } from 'react-icons/fa';

export default function ChatInput() {
  const { profile } = useAuth();
  const room = useRoomStore((state) => state.room);
  const client = getMqttClient();

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
    createDate: new Date().toISOString()
  };

  const onSubmit = async (
    values: ChatBodyType,
    form: UseFormReturn<ChatBodyType>
  ) => {
    if (!room) return;

    try {
      await publishMqttMessage(
        client,
        generateMqttTopic(mqttTopics.ROOM, { roomId: room.id }),
        {
          cmd: mqttCMDs.CREATE_CHAT,
          data: values
        }
      );
      form.reset(defaultValues);
    } catch (error) {
      logger.error('[CREATE_CHAT_ERROR]', error);
      notify.error('Gửi tin nhắn thất bại');
    }
  };

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
            className='min-h-9 resize-none rounded-md bg-gray-100 py-2 pl-8 text-black placeholder:text-gray-400 focus-visible:ring-transparent!'
            maxLengthClassName='right-1.5 -bottom-4'
            placeholder='Chat gì đó...'
            maxRows={4}
            maxLength={200}
            autoSize
          />
          <Button
            className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80 px-3! text-black'
            onClick={handleSendMessage}
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
            loading={form.formState.isSubmitting}
            iconClassName='size-4'
          >
            <TelegramIcon ref={iconRef} />
          </Button>
        </div>
      )}
    </BaseForm>
  );
}
