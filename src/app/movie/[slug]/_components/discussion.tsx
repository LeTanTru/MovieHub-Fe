'use client';

import { CommentDotIcon } from '@/assets';
import { ActionButton } from '@/components/app/action-button';
import { useCommentListQuery, useReviewListQuery } from '@/queries';
import { route } from '@/routes';
import { useAuthStore } from '@/store';
import { getIdFromSlug, renderImageUrl } from '@/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { DEFALT_PAGE_START, DEFAULT_PAGE_SIZE } from '@/constants';
import { AvatarField } from '@/components/form';
import CommentList from './comment-list';
import CommentForm from './comment-form';
import ReviewList from './review-list';
import { Activity } from '@/components/activity';

export default function Discussion() {
  const actions: { key: string; label: string }[] = [
    { key: 'comment', label: 'Bình luận' },
    { key: 'review', label: 'Đánh giá' }
  ];

  const { slug } = useParams<{ slug: string }>();
  const id = getIdFromSlug(slug);

  const [activeKey, setActiveKey] = useState<string>(actions[0].key);
  const { profile } = useAuthStore();

  const { data: commentListData } = useCommentListQuery({
    params: { movieId: id, page: DEFALT_PAGE_START, size: DEFAULT_PAGE_SIZE },
    enabled: !!id && activeKey === actions[0].key
  });

  const { data: reviewListData } = useReviewListQuery({
    params: { movieId: id, page: DEFALT_PAGE_START, size: DEFAULT_PAGE_SIZE },
    enabled: !!id && activeKey === actions[1].key
  });

  const commentList = commentListData?.data?.content || [];
  const reviewList = reviewListData?.data?.content || [];

  const totalMaps: Record<string, number> = {
    [actions[0].key]: commentListData?.data?.totalElements || 0,
    [actions[1].key]: reviewListData?.data?.totalElements || 0
  };

  return (
    <div className='relative block px-10 py-5'>
      {/* Header */}
      <div className='mb-4 flex items-center font-semibold text-white'>
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
      {/* Body */}
      <div className='mb-6'>
        {profile ? (
          <div className='mb-4 flex items-center gap-4'>
            <AvatarField
              src={renderImageUrl(profile?.avatarPath)}
              size={44}
              alt={profile?.fullName}
              className='mx-0'
            />
            <div className='flex flex-col justify-between gap-1'>
              <small className='text-gray-400'>Bình luận với tên</small>
              <span className='text font-medium text-white'>
                {profile?.fullName}
              </span>
            </div>
          </div>
        ) : (
          <div className='mb-4 text-xs text-gray-400'>
            Vui lòng&nbsp;
            <Link
              className='text-light-golden-yellow transition-all duration-200 ease-linear hover:opacity-80'
              href={route.login.path}
            >
              đăng nhập
            </Link>
            &nbsp;để tham gia bình luận.
          </div>
        )}
        <CommentForm />
        <Activity visible={activeKey === actions[0].key}>
          <CommentList comments={commentList} />
        </Activity>
        <Activity visible={activeKey === actions[1].key}>
          <ReviewList reviews={reviewList} />
        </Activity>
      </div>
    </div>
  );
}
