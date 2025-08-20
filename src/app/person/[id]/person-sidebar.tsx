'use client';

import { useState, useRef, useEffect } from 'react';
import { AvatarField, Button } from '@/components/form';
import { apiConfig, genderOptions } from '@/constants';
import { usePersonQuery } from '@/queries/use-person';
import { formatDate } from '@/utils';
import { Heart, X, ChevronDown } from 'lucide-react';
import { RiTelegram2Fill } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

export default function PersonSidebar({ id }: { id: number }) {
  const res = usePersonQuery({ id });
  const person = res.data?.data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollIcon, setShowScrollIcon] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!isModalOpen) return;
    const el = modalContentRef.current;
    if (!el) return;
    const checkScroll = () => {
      setShowScrollIcon(el.scrollTop === 0);
    };

    const timer = setTimeout(checkScroll, 0);

    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      clearTimeout(timer);
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [isModalOpen]);

  return (
    <div className='border-r-transparent-white w-110 flex-shrink-0 border-r p-4'>
      <AvatarField
        className='mx-auto mb-10 rounded-[25%] border-none'
        size={160}
        src={
          person?.avatarPath
            ? `${apiConfig.imageProxy.baseUrl}${person?.avatarPath}`
            : ''
        }
      />
      <h2 className='mb-4 text-center text-2xl leading-1.5 font-semibold text-white'>
        {person?.otherName}
      </h2>
      <p className='text-foreground/60 mb-4 text-center text-sm'>
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
        <p className='text-foreground/60'>
          {genderOptions.find((item) => item.value === person?.gender)?.label ??
            'Đang cập nhật'}
        </p>
      </div>
      <div className='mb-2 flex'>
        Ngày sinh:&nbsp;
        <p className='text-foreground/60'>
          {formatDate(person?.dateOfBirth!) ?? 'Đang cập nhật'}
        </p>
      </div>

      <div>
        Giới thiệu:
        <div className='text-foreground/60 line-clamp-10 text-justify'>
          <div dangerouslySetInnerHTML={{ __html: person?.bio || '' }} />
        </div>
        {person?.bio && (
          <Button
            onClick={handleOpenModal}
            className='bg-accent hover:bg-background mt-2 ml-auto block text-sm text-white'
          >
            Xem thêm
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
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
                onClick={() => setIsModalOpen(false)}
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
                animate={{
                  bottom: showScrollIcon ? 30 : -30,
                  display: showScrollIcon ? 'block' : 'none'
                }}
                transition={{ duration: 0.2, ease: 'linear' }}
              >
                <ChevronDown className='h-6 w-6 text-white' />
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
