'use client';

import { useCollectionTopicListQuery } from '@/queries';
import { MAX_PAGE_SIZE } from '@/constants';
import { TopicItem, TopicItemMore } from '@/components/app/topic-item';
import { VerticalBarLoading } from '@/components/loading';
import { useEffect, useMemo, useState } from 'react';
import { CollectionListHeading } from '@/components/app/heading';
import { route } from '@/routes';

export default function TopicList() {
  const [isSwitched, setIsSwitched] = useState(false);

  const { data: topicListData, isLoading: topicListLoading } =
    useCollectionTopicListQuery({
      enabled: true,
      params: { size: MAX_PAGE_SIZE }
    });

  const topicList = useMemo(
    () => topicListData?.data?.content?.slice(0, 6) || [],
    [topicListData?.data?.content]
  );
  const totalElements = topicListData?.data?.totalElements || 0;

  useEffect(() => {
    if (!topicList.length) return;

    const randomTopic = topicList[Math.floor(Math.random() * topicList.length)];

    const digitSum = (randomTopic?.id?.toString().match(/\d/g) || []).reduce(
      (sum, digit) => sum + Number(digit),
      0
    );

    setIsSwitched(digitSum % 2 === 0);
  }, [topicList]);

  const moreCount = totalElements - topicList.length;

  if (topicListLoading) return <VerticalBarLoading className='py-20' />;

  if (!topicList.length) return null;

  return (
    <div className='max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5'>
      <CollectionListHeading
        title='Bạn đang quan tâm chủ đề gì ?'
        link={route.topic.path}
      />
      <div className='max-1600:grid-cols-6 max-1280:grid-cols-5 max-990:grid-cols-4 max-800:grid-cols-3 max-1120:gap-3 max-480:flex max-480:flex-nowrap max-480:gap-2 max-480:overflow-auto max-480:scrollbar-none grid grid-cols-7 gap-4'>
        {topicList.map((topic) => (
          <TopicItem key={topic.id} topic={topic} isSwitched={isSwitched} />
        ))}
        <TopicItemMore moreCount={moreCount} isSwitched={isSwitched} />
      </div>
    </div>
  );
}
