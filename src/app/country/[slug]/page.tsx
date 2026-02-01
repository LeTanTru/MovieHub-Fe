import {
  countries,
  DEFALT_PAGE_START,
  DEFAULT_PAGE_SIZE,
  queryKeys
} from '@/constants';
import CountryList from './_components/country-list';
import { Metadata } from 'next';
import { generateSlug } from '@/utils';
import { MovieSearchType } from '@/types';
import { getQueryClient } from '@/components/providers';
import { movieApiRequest } from '@/api-requests';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

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
  const countryCode = slug.split('.')[1];
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
  const countryCode = slug.split('.')[1];
  const filters = await searchParams;
  const defaultFilters: MovieSearchType = {
    page: DEFALT_PAGE_START,
    country: countryCode,
    size: DEFAULT_PAGE_SIZE,
    ...filters
  };

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [`${queryKeys.MOVIE}-list`, defaultFilters],
    queryFn: () => movieApiRequest.getList({ params: defaultFilters })
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CountryList countryCode={countryCode} />
    </HydrationBoundary>
  );
}
