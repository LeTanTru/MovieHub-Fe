import { collectionApiRequest, collectionItemApiRequest } from '@/api-requests';
import {
  CollectionItemSearchType,
  ApiResponseList,
  CollectionItemResType
} from '@/types';
import { Container } from '@/components/layout';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_START,
  queryKeys,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT
} from '@/constants';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { generateSlug, getIdFromSlug, stripHtml, truncate } from '@/utils';
import { getQueryClient } from '@/components/providers/query-provider';
import { MovieList } from '@/app/topic/[slug]/_components';
import { BreadcrumbListJsonLd, ItemListJsonLd } from '@/components/seo';
import type { Metadata } from 'next';
import { envConfig } from '@/config';

export const revalidate = 60;

export async function generateStaticParams() {
  const topicList = await collectionApiRequest.getTopicList({
    size: DEFAULT_PAGE_SIZE
  });
  return topicList.data.content.map((topic) => ({
    slug: `${generateSlug(topic.name)}.${topic.id}`
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = getIdFromSlug(slug);
  const res = await collectionApiRequest.getById(id);
  const topic = res.data;
  const title = topic?.name || 'Chủ đề';
  const description = truncate(
    stripHtml(
      `Khám phá danh sách phim thuộc chủ đề ${topic?.name || ''} trên MovieHub. Những bộ phim hay nhất được tuyển chọn kỹ lưỡng, cập nhật liên tục để mang lại trải nghiệm tuyệt vời nhất.`
    ),
    160
  );

  return {
    title,
    description,
    metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
    keywords: [
      topic?.name || 'chủ đề phim',
      'phim theo chủ đề',
      'tuyển tập phim',
      'phim moviehub'
    ],
    openGraph: {
      title,
      description,
      url: `/topic/${slug}`,
      type: 'website',
      images: [
        {
          url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`
      ]
    },
    alternates: {
      canonical: `/topic/${slug}`
    }
  };
}

type TopicDetailPageProps = { params: Promise<{ slug: string }> };

export default async function TopicDetailPage({
  params
}: TopicDetailPageProps) {
  const { slug } = await params;
  const collectionId = getIdFromSlug(slug);
  const queryClient = getQueryClient();

  const collectionItemFilters: CollectionItemSearchType = {
    collectionId,
    page: DEFAULT_PAGE_START,
    size: DEFAULT_PAGE_SIZE
  };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [queryKeys.COLLECTION, collectionId],
      queryFn: () => collectionApiRequest.getById(collectionId)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.COLLECTION_ITEM_LIST, collectionItemFilters],
      queryFn: () => collectionItemApiRequest.getList(collectionItemFilters)
    })
  ]);

  const collectionRes = queryClient.getQueryData<{ data: { name: string } }>([
    queryKeys.COLLECTION,
    collectionId
  ]);
  const topicName = collectionRes?.data?.name || 'chủ đề';

  const collectionItemsRes = queryClient.getQueryData<
    ApiResponseList<CollectionItemResType>
  >([queryKeys.COLLECTION_ITEM_LIST, collectionItemFilters]);
  const collectionItems = collectionItemsRes?.data.content || [];

  const breadcrumbLd = {
    items: [
      { name: 'Trang chủ', item: envConfig.NEXT_PUBLIC_URL },
      {
        name: 'Chủ đề',
        item: `${envConfig.NEXT_PUBLIC_URL}/topic`
      },
      {
        name: topicName,
        item: `${envConfig.NEXT_PUBLIC_URL}/topic/${slug}`
      }
    ]
  };

  const itemListLd = {
    items: collectionItems.map((item, index) => ({
      position: index + 1,
      url: `${envConfig.NEXT_PUBLIC_URL}/movie/${item.slug}.${item.id}`,
      name: item.title
    })),
    itemListName: topicName
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BreadcrumbListJsonLd items={breadcrumbLd.items} />
      {itemListLd.items.length > 0 && <ItemListJsonLd {...itemListLd} />}
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
        <div className='max-640:gap-8 flex flex-col gap-12.5'>
          <MovieList collectionId={collectionId} />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
