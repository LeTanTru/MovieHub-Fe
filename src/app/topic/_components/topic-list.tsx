'use client';

import { NoData } from '@/components/no-data';
import { useCollectionTopicListQuery } from '@/queries';
import { MAX_PAGE_SIZE } from '@/constants';
import { TopicItemSkeleton, TopicItem } from '@/components/app/topic-item';

export default function TopicList() {
  const skeletonCount = 14;

  const { data: topicListData, isLoading: topicListLoading } =
    useCollectionTopicListQuery({
      enabled: true,
      params: { size: MAX_PAGE_SIZE }
    });

  const topicList = topicListData?.data?.content || [];

  const random = Math.random() < 0.5;

  return (
    <div className='mx-auto w-full max-w-475 px-12.5'>
      <div className='flex-start relative mb-5 flex min-h-11 items-center gap-4'>
        <h3 className='text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          Các chủ đề
        </h3>
      </div>
      {topicListLoading ? (
        <div className='grid grid-cols-7 gap-4'>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <TopicItemSkeleton key={i} />
          ))}
        </div>
      ) : topicList.length > 0 ? (
        <div className='grid grid-cols-7 gap-4'>
          {topicList.map((topic) => (
            <TopicItem key={topic.id} topic={topic} random={random} />
          ))}
        </div>
      ) : (
        <NoData className='pt-20 pb-40' content={<>Không có chủ đề nào</>} />
      )}
    </div>
  );
}
