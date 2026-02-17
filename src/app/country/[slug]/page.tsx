import {
  countries,
  DEFAULT_PAGE_START,
  DEFAULT_PAGE_SIZE,
  queryKeys
} from '@/constants';
import { Metadata } from 'next';
import { generateSlug, getIdFromSlug } from '@/utils';
import { MovieSearchType } from '@/types';
import { getQueryClient } from '@/components/providers';
import { movieApiRequest } from '@/api-requests';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { MovieList } from '@/app/country/[slug]/_components';
import { notFound } from 'next/navigation';

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
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<MovieSearchType>;
}) {
  const { slug } = await params;
  const countryCode = getIdFromSlug(slug);

  const filters = await searchParams;
  const defaultFilters: MovieSearchType = {
    page: DEFAULT_PAGE_START,
    country: countryCode,
    size: DEFAULT_PAGE_SIZE,
    ...filters
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
      <MovieList countryCode={countryCode} />
    </HydrationBoundary>
  );
}
