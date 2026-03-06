import { stripHtml } from '@/utils';
import type { Metadata, ResolvingMetadata } from 'next';
import envConfig from '@/config';
import {
  AppConstants,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  PERSON_KIND_ACTOR,
  queryKeys
} from '@/constants';
import { moviePersonApiRequest, personApiRequest } from '@/api-requests';
import { MovieList, PersonSidebar } from '@/app/person/[id]/_components';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/components/providers';
import { ApiResponse, MoviePersonSearchType } from '@/types';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout';

export const revalidate = 60;

export async function generateStaticParams() {
  const persons = await personApiRequest.getList({
    size: DEFAULT_PAGE_SIZE
  });
  return persons.data.content.map((person) => ({
    id: `${person?.id}`
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  const res = await personApiRequest.getById(id);
  const previousImages = (await parent).openGraph?.images || [];
  const images = res.data?.avatarPath
    ? [
        `${AppConstants.contentRootUrl}${res.data?.avatarPath}`,
        ...previousImages
      ]
    : previousImages;

  return {
    title: res.data
      ? `Diễn viên ${res.data?.otherName}`
      : 'Không tìm thấy diễn viên',
    description: stripHtml(res.data?.bio ?? 'Thông tin diễn viên'),
    openGraph: {
      title: res.data
        ? `Diễn viên ${res.data?.otherName}`
        : 'Không tìm thấy diễn viên',
      description: stripHtml(res.data?.bio ?? 'Thông tin diễn viên'),
      images
    },
    twitter: {
      card: 'summary_large_image',
      title: res.data
        ? `Diễn viên ${res.data?.otherName}`
        : 'Không tìm thấy diễn viên',
      description: stripHtml(res.data?.bio ?? 'Thông tin diễn viên'),
      images
    },
    alternates: {
      canonical: `${envConfig.NEXT_PUBLIC_URL}/person/${id}`
    }
  };
}

export default async function PersonDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = getQueryClient();
  const defaultFilters: MoviePersonSearchType = {
    personId: id,
    size: MAX_PAGE_SIZE,
    kind: PERSON_KIND_ACTOR
  };

  try {
    await queryClient.prefetchQuery({
      queryKey: [queryKeys.PERSON, id],
      queryFn: () => personApiRequest.getById(id)
    });

    const personData: ApiResponse<any> | undefined = queryClient.getQueryData([
      queryKeys.PERSON,
      id
    ]);

    if (!personData?.result) {
      notFound();
    }
  } catch (_) {
    notFound();
  }

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.MOVIE_PERSON_LIST, defaultFilters],
    queryFn: () => moviePersonApiRequest.getList(defaultFilters)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
        <div className='relative mx-auto flex w-full max-w-410 justify-between px-5'>
          <PersonSidebar />
          <MovieList />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
