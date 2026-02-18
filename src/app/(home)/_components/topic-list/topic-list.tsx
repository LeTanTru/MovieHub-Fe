'use client';

import { NoData } from '@/components/no-data';
import { useCollectionTopicListQuery } from '@/queries';
import { MAX_PAGE_SIZE } from '@/constants';
import {
  TopicCardSkeleton,
  TopicItemMoreV1,
  TopicItemMoreV2,
  TopicItemV1,
  TopicItemV2
} from '@/components/app/topic-item';

export default function TopicList() {
  const skeletonCount = 7;
  const { data: topicListData, isLoading: topicListLoading } =
    useCollectionTopicListQuery({
      enabled: true,
      params: { size: MAX_PAGE_SIZE }
    });

  const topicList = topicListData?.data?.content?.slice(0, 6) || [];
  const totalElements = topicListData?.data?.totalElements || 0;

  const switchToV2 = Math.random() < 0.5;
  const TopicItem = switchToV2 ? TopicItemV2 : TopicItemV1;
  const TopicItemMore = switchToV2 ? TopicItemMoreV2 : TopicItemMoreV1;

  const moreCount = totalElements - topicList.length;

  if (!topicList.length) return null;

  return (
    <div className='mx-auto w-full max-w-475 px-12.5'>
      <div className='flex-start relative mb-5 flex min-h-11 items-center gap-4'>
        <h3 className='text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          Bạn đang quan tâm chủ đề gì ?
        </h3>
      </div>
      {topicListLoading ? (
        <div className='grid grid-cols-7 gap-4'>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <TopicCardSkeleton key={i} />
          ))}
        </div>
      ) : topicList.length > 0 ? (
        <div className='grid grid-cols-7 gap-4'>
          {topicList.map((topic) => (
            <TopicItem key={topic.id} topic={topic} />
          ))}
          <TopicItemMore moreCount={moreCount} />
        </div>
      ) : (
        <NoData className='pt-20 pb-40' content={<>Không có chủ đề nào</>} />
      )}
    </div>
  );
}
