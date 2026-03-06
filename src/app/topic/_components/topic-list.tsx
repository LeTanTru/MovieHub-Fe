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

  const isSwitched = Math.random() < 0.5;

  return (
    <div className='max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5'>
      <div className='max-1120:mb-5 max-990:mb-4 max-640:mb-3 max-480:mb-2 mb-6'>
        <h3 className='max-990:text-2xl max-640:text-[22px] max-480:text-xl text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          Các chủ đề
        </h3>
      </div>
      {topicListLoading ? (
        <div className='max-1600:grid-cols-6 max-1280:grid-cols-5 max-990:grid-cols-4 max-800:grid-cols-3 max-1120:gap-3 max-480:grid-cols-2 max-640:gap-2 max-480:[&_.topic-item]:w-full grid grid-cols-7 gap-4'>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <TopicItemSkeleton key={i} />
          ))}
        </div>
      ) : topicList.length > 0 ? (
        <div className='max-1600:grid-cols-6 max-1280:grid-cols-5 max-990:grid-cols-4 max-800:grid-cols-3 max-1120:gap-3 max-480:grid-cols-2 max-640:gap-2 max-480:[&_.topic-item]:w-full grid grid-cols-7 gap-4'>
          {topicList.map((topic) => (
            <TopicItem key={topic.id} topic={topic} isSwitched={isSwitched} />
          ))}
        </div>
      ) : (
        <NoData className='pt-20 pb-40' content={<>Không có chủ đề nào</>} />
      )}
    </div>
  );
}
