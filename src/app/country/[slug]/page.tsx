import {
  countries,
  DEFAULT_PAGE_START,
  DEFAULT_PAGE_SIZE,
  queryKeys
} from '@/constants';
import { Metadata } from 'next';
import { generateSlug, getIdFromSlug } from '@/utils';
import { MovieSearchType } from '@/types';
import { getQueryClient } from '@/components/providers/query-provider';
import { movieApiRequest } from '@/api-requests';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { MovieList } from '@/app/country/[slug]/_components';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout';

export const revalidate = 60;

export async function generateStaticParams() {
  return countries.slice(0, DEFAULT_PAGE_SIZE).map((country) => ({
    slug: `${generateSlug(country.label)}.${country.value}`
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const countryCode = getIdFromSlug(slug);
  const countryName = countries.find(
    (country) => country.value === countryCode
  )?.label;

  return {
    title: `Phim ${countryName}`
  };
}

export default async function CountryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const countryCode = getIdFromSlug(slug);

  const defaultFilters: MovieSearchType = {
    page: DEFAULT_PAGE_START,
    country: countryCode,
    size: DEFAULT_PAGE_SIZE
  };

  const queryClient = getQueryClient();

  if (!countries.find((country) => country.value === countryCode)) {
    notFound();
  }

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.MOVIE_LIST, defaultFilters],
    queryFn: () => movieApiRequest.getList(defaultFilters)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
        <div className='max-640:gap-8 flex flex-col gap-12.5'>
          <MovieList countryCode={countryCode} />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
