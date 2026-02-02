'use client';

import { CommentDotIcon } from '@/assets/icons';
import { Button } from '@/components/form';
import { cn } from '@/lib';
import { useCommentListQuery, useReviewListQuery } from '@/queries';
import { CommentResType, ReviewResType } from '@/types';
import { getIdFromSlug } from '@/utils';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function Comment() {
  const actions: { key: string; label: string }[] = [
    { key: 'comment', label: 'Bình luận' },
    { key: 'review', label: 'Đánh giá' }
  ];

  const { slug } = useParams<{ slug: string }>();
  const id = getIdFromSlug(slug);

  const [activeKey, setActiveKey] = useState<string>(actions[0].key);

  const { data: commentListData } = useCommentListQuery({
    params: { movieId: id },
    enabled: !!id && activeKey === actions[0].key
  });

  const { data: reviewListData } = useReviewListQuery({
    params: { movieId: id },
    enabled: !!id && activeKey === actions[1].key
  });

  const dataMaps: Record<string, CommentResType[] | ReviewResType[]> = {
    [actions[0].key]: commentListData?.data?.content || [],
    [actions[1].key]: reviewListData?.data?.content || []
  };

  const totalMaps: Record<string, number> = {
    [actions[0].key]: commentListData?.data?.totalElements || 0,
    [actions[1].key]: reviewListData?.data?.totalElements || 0
  };

  return (
    <div className='relative block px-10 py-5'>
      <div className='mb-4 flex font-semibold text-white'>
        <div className='flex grow gap-2'>
          <div className='h-6 w-6'>
            <CommentDotIcon />
          </div>
          <span>
            {actions.find((action) => action.key === activeKey)?.label}
            &nbsp;({totalMaps[activeKey]})
          </span>
        </div>
        <div
          className='relative flex shrink-0 items-center overflow-hidden rounded border border-solid border-white p-0.5 text-sm font-normal'
          role='tablist'
        >
          {actions.map((action) => (
            <ActionButton
              key={action.key}
              label={action.label}
              action={action.key}
              activeKey={activeKey}
              setActiveKey={setActiveKey}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  action,
  label,
  activeKey,
  setActiveKey
}: {
  action: string;
  label: string;
  activeKey: string;
  setActiveKey: (key: string) => void;
}) {
  const isActive = action === activeKey;

  return (
    <div className='relative flex-1'>
      {isActive && (
        <motion.div
          layoutId='tab-bg'
          className='absolute inset-0 rounded bg-white'
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      )}

      <Button
        variant='ghost'
        className={cn(
          'relative flex h-6.5 cursor-pointer items-center rounded-none! px-2 text-sm transition-all duration-200 ease-linear hover:bg-transparent!',
          {
            'text-gray-200 hover:opacity-80': !isActive,
            'text-black hover:text-black': isActive
          }
        )}
        onClick={() => setActiveKey(action)}
      >
        <span className='relative z-10'>{label}</span>
      </Button>
    </div>
  );
}
