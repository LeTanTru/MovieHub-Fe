import { collectionApiRequest } from '@/api-requests';
import { MovieList } from '@/app/topic/[slug]/_components';
import { DEFAULT_PAGE_SIZE } from '@/constants';

export async function generateStaticParams() {
  const topicList = await collectionApiRequest.getTopicList({
    params: { size: DEFAULT_PAGE_SIZE }
  });
  return topicList.data.content.map((topic) => ({
    slug: `${topic.name}.${topic.id}`
  }));
}

export default async function TopicDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collectionId = slug.split('.')[1];
  return <MovieList collectionId={collectionId} />;
}
