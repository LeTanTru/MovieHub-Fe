'use client';

import { NoData } from '@/components/no-data';
import { cn } from '@/lib';
import { useCollectionTopicListQuery } from '@/queries';
import { AnimatePresence } from 'framer-motion';
import TopicListSkeleton from './topic-skeleton';
import { MAX_PAGE_SIZE } from '@/constants';
import { TopicItemV1, TopicItemV2 } from '@/components/app/topic-item';

export default function TopicList() {
  const { data: topicListData, isLoading: topicListLoading } =
    useCollectionTopicListQuery({
      enabled: true,
      params: { size: MAX_PAGE_SIZE }
    });

  const topicList = topicListData?.data?.content || [];

  const switchToV2 = Math.random() < 0.5;
  const TopicItem = switchToV2 ? TopicItemV2 : TopicItemV1;

  return (
    <div className='max-989:mb-2.5 mb-5'>
      <h3 className='max-1600:text-2xl m-0 mb-6 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
        Chủ đề
      </h3>
      <div
        className={cn('grid grid-cols-7 gap-4 max-[1537px]:grid-cols-6', {
          'grid-cols-1': topicListLoading || topicList.length === 0
        })}
      >
        <AnimatePresence mode='popLayout' initial={false}>
          {topicListLoading ? (
            <TopicListSkeleton />
          ) : topicList.length > 0 ? (
            topicList.map((topic) => <TopicItem key={topic.id} topic={topic} />)
          ) : (
            <NoData
              className='pt-20 pb-40'
              content={<>Không có chủ đề nào</>}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
