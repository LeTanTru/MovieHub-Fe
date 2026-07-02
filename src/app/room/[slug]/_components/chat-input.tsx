'use client';

import { TelegramIcon } from '@/assets';
import { Button, TextAreaField } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { DATE_TIME_FORMAT, mqttCMDs, mqttTopics } from '@/constants';
import { useAuth, useClickAnimation, useClickOutside } from '@/hooks';
import { cn } from '@/lib';
import { logger } from '@/logger';
import { chatSchema } from '@/schemaValidations';
import { useRoomStore } from '@/store';
import { ChatBodyType } from '@/types';
import type { UseFormReturn } from 'react-hook-form';
import {
  convertLocalToUTC,
  formatNow,
  generateMqttTopic,
  notify,
  publishMqttMessage
} from '@/utils';
import { useEffect, useRef, useState } from 'react';

type EmojiClickEvent = Event & {
  detail: {
    unicode: string;
  };
};

type EmojiPickerElement = HTMLElement & {
  i18n: unknown;
};
import { FaRegFaceGrinBeam } from 'react-icons/fa6';

export default function ChatInput() {
  const { profile } = useAuth();
  const room = useRoomStore((state) => state.room);

  const { iconRef, startAnimation } = useClickAnimation();

  const formMethodsRef = useRef<UseFormReturn<ChatBodyType> | null>(null);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const wrapperRef = useClickOutside<HTMLDivElement>(() =>
    setShowPicker(false)
  );
  const pickerContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    startAnimation();
  };

  const defaultValues: ChatBodyType = {
    accountId: profile?.id || '',
    content: '',
    user: {
      fullName: profile?.fullName || '',
      id: profile?.id || '',
      avatarPath: profile?.avatarPath || null,
      username: profile?.username || null
    },
    createdDate: ''
  };

  const onSubmit = async (
    values: ChatBodyType,
    form: UseFormReturn<ChatBodyType>
  ) => {
    if (!room) return;

    const payload = {
      ...values,
      createdDate: convertLocalToUTC(
        formatNow(DATE_TIME_FORMAT),
        DATE_TIME_FORMAT,
        DATE_TIME_FORMAT
      )
    };

    try {
      await publishMqttMessage(
        generateMqttTopic(mqttTopics.ROOM, { roomId: room.id }),
        {
          cmd: mqttCMDs.CREATE_CHAT,
          data: payload
        }
      );
      form.reset(defaultValues);
      setShowPicker(false);
    } catch (error) {
      logger.error('[CREATE_CHAT_ERROR]', error);
      notify.error('Gửi tin nhắn thất bại');
    }
  };

  useEffect(() => {
    let picker: EmojiPickerElement | null = null;
    let mounted = true;
    let emojiClickHandler: EventListener | null = null;

    (async () => {
      const { Picker } = await import('emoji-picker-element');
      const vi = (await import('emoji-picker-element/i18n/vi')).default;

      if (!mounted) return;

      picker = new Picker() as EmojiPickerElement;
      picker.i18n = vi;
      picker.className = 'chat-input-emoji-picker';
      picker.style.cssText = `
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s linear;
      `;
      picker.style.setProperty('--border-radius', '8px');
      picker.style.setProperty('--border-size', '0');

      emojiClickHandler = (event) => {
        const emojiEvent = event as EmojiClickEvent;
        const emoji = emojiEvent.detail.unicode;
        if (formMethodsRef.current) {
          const currentValue =
            formMethodsRef.current.getValues('content') || '';
          formMethodsRef.current.setValue('content', currentValue + emoji, {
            shouldDirty: true,
            shouldTouch: true
          });
        }
      };

      picker.addEventListener('emoji-click', emojiClickHandler);

      if (pickerContainerRef.current) {
        pickerContainerRef.current.appendChild(picker);
      }
    })();

    return () => {
      mounted = false;
      if (picker && emojiClickHandler) {
        picker.removeEventListener('emoji-click', emojiClickHandler);
      }
      if (picker && picker.parentNode) picker.parentNode.removeChild(picker);
    };
  }, []);

  useEffect(() => {
    const pickerEl = pickerContainerRef.current?.querySelector('emoji-picker');

    if (pickerEl) {
      pickerEl.style.opacity = showPicker ? '1' : '0';
      pickerEl.style.visibility = showPicker ? 'visible' : 'hidden';
    }
  }, [showPicker]);

  return (
    <BaseForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      schema={chatSchema}
      className='rounded-md bg-transparent p-0'
    >
      {(form) => {
        formMethodsRef.current = form;
        return (
          <div className='relative' ref={wrapperRef}>
            <div
              ref={pickerContainerRef}
              className={cn('absolute bottom-full left-0 mb-2', {
                'pointer-events-none': !showPicker
              })}
            />
            <div className='flex gap-2'>
              <div className='relative flex-1'>
                <button
                  type='button'
                  onClick={() => setShowPicker((prev) => !prev)}
                  className='absolute top-1/2 left-2 z-9 flex -translate-y-1/2 cursor-pointer items-center text-gray-400 transition-all duration-200 ease-linear hover:text-gray-300'
                >
                  <FaRegFaceGrinBeam className='size-4.5' />
                </button>
                <TextAreaField
                  control={form.control}
                  name='content'
                  formItemClassName='w-full'
                  className='focus-visible:ring-outer-space min-h-9 resize-none rounded-md border-none bg-gray-100 py-2 pl-8 text-white focus-visible:ring-2'
                  maxLengthClassName='right-1.5 -bottom-5'
                  placeholder='Chat gì đó...'
                  maxRows={4}
                  maxLength={200}
                  autoSize
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      e.currentTarget.form?.requestSubmit();
                    }
                  }}
                />
              </div>
              <Button
                className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80 shrink-0 px-3! text-black'
                onClick={handleSendMessage}
                disabled={
                  !form.formState.isDirty || form.formState.isSubmitting
                }
                loading={form.formState.isSubmitting}
                iconClassName='size-4'
              >
                <TelegramIcon ref={iconRef} />
              </Button>
            </div>
          </div>
        );
      }}
    </BaseForm>
  );
}
