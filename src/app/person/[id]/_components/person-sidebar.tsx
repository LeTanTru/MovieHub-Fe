'use client';

import { useState, useRef, useEffect } from 'react';
import { AvatarField, Button } from '@/components/form';
import { DEFAULT_DATE_FORMAT, genderOptions } from '@/constants';
import { formatDate, renderImageUrl } from '@/utils';
import { Heart, X } from 'lucide-react';
import { RiTelegram2Fill } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib';
import { FaArrowDown } from 'react-icons/fa6';
import { useDisclosure, useMobile } from '@/hooks';
import { usePersonQuery } from '@/queries';
import PersonSidebarSkeleton from './person-sidebar-skeleton';

export default function PersonSidebar({ id }: { id: string }) {
  const { opened, open, close } = useDisclosure();
  const [showScrollIcon, setShowScrollIcon] = useState<boolean>(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();
  const { data: personData, isLoading: personLoading } = usePersonQuery({ id });
  const person = personData?.data;

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

    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [opened]);

  return personLoading ? (
    <PersonSidebarSkeleton isMobile={isMobile} />
  ) : (
    <div className='border-r-transparent-white max-1120:w-full max-1120:border-none max-1120:pr-0 max-1600:w-85 w-110 shrink-0 border-r pr-10'>
      <AvatarField
        className={cn('mx-auto mb-6 rounded-full border-none', {
          'rounded-full': !person?.avatarPath
        })}
        previewClassName={cn({
          rounded: person?.avatarPath
        })}
        size={160}
        src={renderImageUrl(person?.avatarPath)}
      />
      <h2 className='mb-4 text-center text-2xl leading-1.5 font-semibold text-white'>
        {person?.otherName}
      </h2>
      <p className='text-foreground/80 mb-4 text-center text-sm'>
        {person?.name}
      </p>

      <div className='mb-4 flex justify-center gap-2'>
        <ActionButton
          icon={<Heart className='h-4 w-4 fill-white stroke-transparent' />}
          label='Yêu thích'
        />
        <ActionButton
          icon={<RiTelegram2Fill className='h-4 w-4 fill-white' />}
          label='Chia sẻ'
        />
      </div>

      <div className='mb-2 flex'>
        Giới tính:&nbsp;
        <p className='text-foreground/80'>
          {genderOptions.find((item) => item.value === person?.gender)?.label ??
            'Đang cập nhật'}
        </p>
      </div>
      <div className='mb-2 flex'>
        Ngày sinh:&nbsp;
        <p className='text-foreground/80'>
          {formatDate(person?.dateOfBirth, DEFAULT_DATE_FORMAT) ??
            'Đang cập nhật'}
        </p>
      </div>

      <div>
        Giới thiệu:
        <div className='text-foreground/80 line-clamp-10 text-justify'>
          <div
            className='text-foreground/80'
            dangerouslySetInnerHTML={{ __html: person?.bio || '' }}
          />
        </div>
        {person?.bio && (
          <Button
            onClick={handleOpenModal}
            className='bg-accent hover:bg-background max-1120:mx-auto max-1120:mb-4 max-1120:w-110 max-1600:mt-4 max-800:w-full mt-2 ml-auto block text-sm text-white'
            variant='secondary'
          >
            Xem thêm
          </Button>
        )}
      </div>

      <AnimatePresence>
        {opened && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/80'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              ref={modalContentRef}
              className='bg-background scrollbar-none relative max-h-[80vh] w-[90%] max-w-2xl overflow-y-auto rounded-lg p-6'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant='ghost'
                className='absolute top-2 right-0 hover:bg-transparent!'
                onClick={handleCloseModal}
              >
                <X className='size-5' />
              </Button>
              <h2 className='mb-4 text-xl font-semibold'>
                {person?.otherName}
              </h2>
              <div
                className='text-foreground/80 text-justify'
                dangerouslySetInnerHTML={{ __html: person?.bio || '' }}
              />
              <motion.div
                className='bg-accent absolute bottom-2 left-1/2 -translate-x-1/2 animate-bounce rounded-full p-2'
                initial={{ bottom: -30, display: 'none' }}
                animate={{
                  bottom: showScrollIcon ? 30 : -30,
                  display: showScrollIcon ? 'block' : 'none'
                }}
                transition={{ duration: 0.2, ease: 'linear' }}
              >
                <FaArrowDown className='h-6 w-6 text-white' />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionButton({
  icon,
  label
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className='flex cursor-pointer items-center gap-2 rounded-[48px] border border-white px-4 py-2 text-[13px] text-white hover:opacity-80'>
      {icon}
      <span>{label}</span>
    </div>
  );
}
