import { stripHtml } from '@/utils';
import type { Metadata, ResolvingMetadata } from 'next';
import envConfig from '@/config';
import {
  AppConstants,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  PERSON_ACTOR,
  queryKeys
} from '@/constants';
import { moviePersonApiRequest, personApiRequest } from '@/api-requests';
import { MovieList, PersonSidebar } from '@/app/person/[id]/_components';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/components/providers';
import { MoviePersonSearchType } from '@/types';

export async function generateStaticParams() {
  const persons = await personApiRequest.getList({
    params: { size: DEFAULT_PAGE_SIZE }
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

  const res = await personApiRequest.getById({ id });
  const plainDescription = stripHtml(
    res.data?.bio ?? 'Thông tin diễn viên'
  ).slice(0, 160);
  const previousImages = (await parent).openGraph?.images || [];
  const images = res.data?.avatarPath
    ? [
        `${AppConstants.contentRootUrl}${res.data?.avatarPath}`,
        ...previousImages
      ]
    : previousImages;

  return {
    title: `Thông tin diễn viên ${res.data?.otherName}`,
    description: plainDescription,
    openGraph: {
      title: `Thông tin diễn viên ${res.data?.otherName}`,
      description: plainDescription,
      images
    },
    twitter: {
      card: 'summary_large_image',
      title: `Thông tin diễn viên ${res.data?.otherName}`,
      description: plainDescription,
      images
    },
    alternates: {
      canonical: `${envConfig.NEXT_PUBLIC_URL}/person/${id}`
    }
  };
}

export default async function PersonDetailPage({
  params,
  searchParams
}: {
  searchParams: Promise<MoviePersonSearchType>;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = getQueryClient();
  const filters = await searchParams;
  const defaultFilters: MoviePersonSearchType = {
    personId: id,
    size: MAX_PAGE_SIZE,
    kind: PERSON_ACTOR,
    ...filters
  };

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.PERSON, id],
    queryFn: () => personApiRequest.getById({ id })
  });

  await queryClient.prefetchQuery({
    queryKey: [`${queryKeys.MOVIE_PERSON}-list`, defaultFilters],
    queryFn: () => moviePersonApiRequest.getList({ params: defaultFilters })
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='max-1120:flex-col max-1120:px-0 relative mx-auto flex w-full max-w-410 items-stretch justify-between gap-0 px-5 py-0'>
        <PersonSidebar id={id} />
        <MovieList id={id} />
      </div>
    </HydrationBoundary>
  );
}
