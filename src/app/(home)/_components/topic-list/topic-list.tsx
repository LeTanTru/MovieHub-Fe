'use client';

import { useCollectionTopicListQuery } from '@/queries';
import { MAX_PAGE_SIZE } from '@/constants';
import { TopicItem, TopicItemMore } from '@/components/app/topic-item';
import { VerticalBarLoading } from '@/components/loading';
import { useRef } from 'react';

export default function TopicList() {
  const { data: topicListData, isLoading: topicListLoading } =
    useCollectionTopicListQuery({
      enabled: true,
      params: { size: MAX_PAGE_SIZE }
    });

  const topicList = topicListData?.data?.content?.slice(0, 6) || [];
  const totalElements = topicListData?.data?.totalElements || 0;

  const isSwitchedRef = useRef<boolean | null>(null);
  if (isSwitchedRef.current === null) {
    isSwitchedRef.current = Math.random() < 0.5;
  }
  const isSwitched = isSwitchedRef.current;

  const moreCount = totalElements - topicList.length;

  if (topicListLoading) return <VerticalBarLoading className='py-20' />;

  if (!topicList.length) return null;

  return (
    <div className='max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5'>
      <div className='max-1120:mb-5 max-990:mb-4 max-480:justify-between relative mb-6 flex items-center justify-start gap-4'>
        <h3 className='max-1600:text-2xl max-640:text-xl text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          Bạn đang quan tâm chủ đề gì ?
        </h3>
      </div>

      <div className='max-1600:grid-cols-6 max-1280:grid-cols-5 max-990:grid-cols-4 max-800:grid-cols-3 max-1120:gap-3 max-480:flex max-480:flex-nowrap max-480:gap-2 max-480:overflow-auto max-480:scrollbar-none grid grid-cols-7 gap-4'>
        {topicList.map((topic) => (
          <TopicItem key={topic.id} topic={topic} isSwitched={isSwitched} />
        ))}
        <TopicItemMore moreCount={moreCount} isSwitched={isSwitched} />
      </div>
    </div>
  );
}
