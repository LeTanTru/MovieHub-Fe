'use client';

import { NoData } from '@/components/no-data';
import { useCollectionTopicListQuery } from '@/queries';
import { MAX_PAGE_SIZE } from '@/constants';
import { TopicItemSkeleton, TopicItem } from '@/components/app/topic-item';
import { useEffect, useMemo, useState } from 'react';
import { ListHeading } from '@/components/app/heading';

export default function TopicList() {
  const skeletonCount = 14;
  const [isSwitched, setIsSwitched] = useState(false);

  const { data: topicListData, isLoading: topicListLoading } =
    useCollectionTopicListQuery({
      enabled: true,
      params: { size: MAX_PAGE_SIZE }
    });

  const topicList = useMemo(
    () => topicListData?.data?.content || [],
    [topicListData?.data?.content]
  );

  useEffect(() => {
    if (!topicList.length) return;

    const randomTopic = topicList[Math.floor(Math.random() * topicList.length)];

    const digitSum = (randomTopic?.id?.toString().match(/\d/g) || []).reduce(
      (sum, digit) => sum + Number(digit),
      0
    );

    setIsSwitched(digitSum % 2 === 0);
  }, [topicList]);

  return (
    <div className='max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5'>
      <ListHeading title='Các chủ đề' />
      {topicListLoading ? (
        <div className='max-1600:grid-cols-6 max-1280:grid-cols-5 max-990:grid-cols-4 max-800:grid-cols-3 max-1120:gap-3 max-480:grid-cols-2 max-640:gap-2 max-480:[&_.topic-item]:w-full grid grid-cols-7 gap-4'>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <TopicItemSkeleton key={index} />
          ))}
        </div>
      ) : topicList.length > 0 ? (
        <div className='max-1600:grid-cols-6 max-1280:grid-cols-5 max-990:grid-cols-4 max-800:grid-cols-3 max-1120:gap-3 max-480:grid-cols-2 max-640:gap-2 max-480:[&_.topic-item]:w-full grid grid-cols-7 gap-4'>
          {topicList.map((topic) => (
            <TopicItem key={topic.id} topic={topic} isSwitched={isSwitched} />
          ))}
        </div>
      ) : (
        <NoData
          className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
          imageClassName='max-640:size-40 max-480:size-30'
          content={<>Không có chủ đề nào</>}
        />
      )}
    </div>
  );
}
