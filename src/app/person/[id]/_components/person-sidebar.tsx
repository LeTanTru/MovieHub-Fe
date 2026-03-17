'use client';

import { useState, useRef, useEffect } from 'react';
import { AvatarField, Button } from '@/components/form';
import {
  DEFAULT_DATE_FORMAT,
  genderOptions,
  movieTabPersonTitles,
  PERSON_KIND_ACTOR
} from '@/constants';
import { formatDate, renderImageUrl, sanitizeText } from '@/utils';
import { X } from 'lucide-react';
import { AnimatePresence, m } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa6';
import { useDisclosure, useQueryParams } from '@/hooks';
import PersonSidebarSkeleton from './person-sidebar-skeleton';
import { ButtonLike } from '@/components/app/button-like';
import { ButtonSharePerson } from '@/components/app/button-share';
import { PersonResType, PersonSearchType } from '@/types';

export default function PersonSidebar({
  person,
  loading
}: {
  person: PersonResType;
  loading: boolean;
}) {
  const { opened, open, close } = useDisclosure();
  const [showScrollIcon, setShowScrollIcon] = useState<boolean>(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const { searchParams } = useQueryParams<PersonSearchType>();
  const kind = searchParams.kind;

  const handleOpenModal = () => open();
  const handleCloseModal = () => close();

  useEffect(() => {
    if (!opened) return;
    const el = modalContentRef.current;
    if (!el) return;

    const checkScroll = () => {
      const canScroll = el.scrollHeight > el.clientHeight;
      const atTop = el.scrollTop === 0;
      setShowScrollIcon(canScroll && atTop);
    };

    checkScroll();

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [opened]);

  const sanitizedBio = sanitizeText(person?.bio || 'Đang cập nhật');

  const role =
    person?.kinds
      ?.map((kind) => movieTabPersonTitles[kind])
      ?.sort((a, b) => a.localeCompare(b))
      .join(', ') || '';

  if (loading) return <PersonSidebarSkeleton />;

  return (
    <div className='border-r-transparent-white max-1600:w-85 max-1120:border-none max-1120:pr-0 max-1120:pb-5 max-1120:w-full max-1120:items-center w-110 shrink-0 border-r pr-10'>
      <AvatarField
        size={120}
        src={renderImageUrl(person?.avatarPath)}
        alt={person?.otherName}
        className='mx-auto'
        breakpoints={[
          {
            breakpoint: 640,
            size: 160
          }
        ]}
      />
      <h2 className='max-800:text-xl max-640:text-lg max-640:mb-0 max-640:mt-2 mt-4 mb-2 text-center text-2xl font-semibold text-white'>
        {person?.otherName}
      </h2>
      <p className='text-foreground/80 mb-2 text-center'>{person?.name}</p>

      <div className='max-640:gap-2 mb-4 flex justify-center gap-4'>
        {kind === PERSON_KIND_ACTOR ||
        person?.kinds.includes(PERSON_KIND_ACTOR) ? (
          <ButtonLike
            className='max-640:text-[13px] max-480:text-xs'
            targetId={person.id}
            variant='person'
          />
        ) : null}
        <ButtonSharePerson className='max-640:text-[13px] max-480:text-xs' />
      </div>

      <div className='max-1120:bg-[rgba(0,0,0,.2)] max-1120:p-4 max-1120:rounded-md'>
        <div className='mb-2 flex'>
          Giới tính:&nbsp;
          <p className='text-foreground/80'>
            {genderOptions.find((item) => item.value === person?.gender)
              ?.label ?? 'Đang cập nhật'}
          </p>
        </div>
        <div className='mb-2 flex'>
          Ngày sinh:&nbsp;
          <p className='text-foreground/80'>
            {formatDate(person?.dateOfBirth, DEFAULT_DATE_FORMAT) ??
              'Đang cập nhật'}
          </p>
        </div>
        <div className='mb-2 flex'>
          Vai trò:&nbsp;
          <p className='text-foreground/80'>
            {role?.charAt(0).toUpperCase() + role?.slice(1)?.toLowerCase() ||
              'Đang cập nhật'}
          </p>
        </div>
        <div>
          Giới thiệu:
          <div className='text-foreground/80 line-clamp-10 text-justify'>
            <div
              className='text-foreground/80'
              dangerouslySetInnerHTML={{ __html: sanitizedBio }}
            />
          </div>
          {person?.bio && (
            <Button
              onClick={handleOpenModal}
              className='dark:hover:bg-main-background max-1120:mx-auto mt-2 ml-auto block border-none dark:bg-white/5 dark:text-white'
              variant='secondary'
            >
              Xem thêm
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {opened && (
          <m.div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/80'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <m.div
              ref={modalContentRef}
              className='scrollbar-none bg-bunker relative max-h-[80vh] w-[90%] max-w-2xl overflow-y-auto rounded-lg p-6'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant='ghost'
                className='absolute top-2 right-0 dark:hover:bg-transparent'
                onClick={handleCloseModal}
              >
                <X className='size-5' />
              </Button>
              <h2 className='mb-4 text-xl font-semibold'>
                {person?.otherName}
              </h2>
              <div
                className='text-foreground/80 text-justify'
                dangerouslySetInnerHTML={{ __html: sanitizedBio }}
              />
              <m.div
                className='bg-accent absolute bottom-2 left-1/2 -translate-x-1/2 animate-bounce rounded-full p-2'
                initial={{ bottom: -30, display: 'none' }}
                animate={{
                  bottom: showScrollIcon ? 30 : -30,
                  display: showScrollIcon ? 'block' : 'none'
                }}
                transition={{ duration: 0.2, ease: 'linear' }}
              >
                <FaArrowDown className='h-6 w-6 text-white' />
              </m.div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
