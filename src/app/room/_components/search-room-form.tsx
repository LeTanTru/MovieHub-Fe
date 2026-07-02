'use client';

import { AnimatePresence, m } from 'framer-motion';
import { AvatarField, InputField } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { generateSlug, renderImageUrl } from '@/utils';
import Image from 'next/image';
import { route } from '@/routes';
import { roomCodeSearchSchema } from '@/schemaValidations';
import { RoomCodeSearchType } from '@/types';
import { Search } from 'lucide-react';
import { useClickOutside, useDisclosure, useNavigate } from '@/hooks';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useRoomByCodeQuery } from '@/queries';
import { VerticalBarLoading } from '@/components/loading';
import debounce from 'lodash/debounce';

const defaultValues: RoomCodeSearchType = { code: '' };
const SEARCH_DEBOUNCE_MS = 300;

export function SearchRoomForm() {
  const navigate = useNavigate();

  const [code, setCode] = useState('');

  const {
    opened: showResult,
    open: openResult,
    close: closeResult
  } = useDisclosure();

  const wrapperRef = useClickOutside<HTMLDivElement>(() => {
    closeResult();
  });

  const {
    data: room,
    isLoading,
    isFetching
  } = useRoomByCodeQuery({ code, enabled: !!code });

  const handleCodeChange = useMemo(
    () =>
      debounce((value: string) => setCode(value.trim()), SEARCH_DEBOUNCE_MS),
    []
  );

  useEffect(() => {
    return () => handleCodeChange.cancel();
  }, [handleCodeChange]);

  const handleOnChange = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.name !== 'code') return;
    handleCodeChange(target.value);
  };

  const formRef = useRef<HTMLFormElement>(null);

  const handleSelectRoom = () => {
    if (!room) return;
    navigate.push(`${route.room.path}/${generateSlug(room.name)}.${room.id}`);
    closeResult();
    setCode('');
    handleCodeChange.cancel();
    formRef.current?.reset();
  };

  return (
    <div
      className='max-990:max-w-70 max-640:max-w-full max-640:order-last relative w-full max-w-100'
      ref={wrapperRef}
    >
      <BaseForm
        ref={formRef}
        schema={roomCodeSearchSchema}
        defaultValues={defaultValues}
        onSubmit={() => {}}
        className='bg-transparent p-0'
        onChange={handleOnChange}
        onClick={openResult}
      >
        {(form) => (
          <InputField
            control={form.control}
            name='code'
            placeholder='Tìm phòng theo mã'
            prefixIcon={<Search size={16} className='text-white' />}
            autoComplete='off'
          />
        )}
      </BaseForm>
      <AnimatePresence>
        {showResult && code && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='bg-gunmetal-black shadow-gunmetal-blue absolute top-[calc(100%+5px)] left-0 z-10 w-full rounded p-3 shadow-[0px_0px_10px_1px]'
          >
            {isLoading || isFetching ? (
              <VerticalBarLoading className='mx-auto' />
            ) : room ? (
              <button
                type='button'
                onClick={handleSelectRoom}
                className='hover:bg-transparent-black-8 flex w-full cursor-pointer items-center gap-3 rounded p-2 text-left text-white transition-colors duration-200 ease-linear'
              >
                <div className='bg-gunmetal-blue relative h-12 w-20 shrink-0 overflow-hidden rounded'>
                  <Image
                    src={renderImageUrl(room.movieItem.thumbnailUrl)}
                    alt={room.movieItem.movie.title}
                    fill
                    sizes='80px'
                    className='object-cover'
                  />
                </div>
                <div className='flex min-w-0 flex-1 flex-col gap-1'>
                  <span className='truncate font-medium'>{room.name}</span>
                  <span className='text-dark-gray truncate text-xs'>
                    {room.movieItem.movie.title}
                  </span>
                  <div className='flex items-center gap-1.5'>
                    <AvatarField
                      src={renderImageUrl(room.host.avatarPath)}
                      size={16}
                      disablePreview
                    />
                    <span className='text-dark-gray truncate text-xs'>
                      {room.host.fullName}
                    </span>
                    <span className='text-dark-gray shrink-0 text-xs'>
                      · Mã: {room.code}
                    </span>
                  </div>
                </div>
              </button>
            ) : (
              <div className='text-dark-gray py-2 text-center text-sm'>
                Không tìm thấy phòng nào
              </div>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
