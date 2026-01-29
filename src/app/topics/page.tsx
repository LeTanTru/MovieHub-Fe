import { TopicList } from '@/app/topics/_components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chủ đề'
};

export default function TopicPage() {
  return <TopicList />;
}
