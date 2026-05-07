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
import { Container } from '@/components/layout';
import envConfig from '@/config';

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
  const countryName =
    countries.find((country) => country.value === countryCode)?.label ||
    'quốc gia';
  const title = countryName ? `Phim ${countryName}` : 'Phim theo quốc gia';
  const description = countryName
    ? `Khám phá danh sách phim ${countryName} mới nhất trên MovieHub. Tổng hợp các bộ phim từ ${countryName} hay nhất, đa dạng thể loại, cập nhật thường xuyên với chất lượng tốt nhất.`
    : 'Xem danh sách phim theo quốc gia mới nhất trên MovieHub. Tuyển tập phim từ nhiều quốc gia trên thế giới, cập nhật nhanh chóng và đầy đủ nhất.';

  return {
    title,
    description,
    metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
    keywords: [
      countryName,
      'quốc gia phim',
      'phim moviehub',
      `phim ${countryName?.toLowerCase()}`
    ],
    openGraph: {
      title,
      description,
      url: `/country/${slug}`,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    },
    alternates: {
      canonical: `/country/${slug}`
    }
  };
}

type CountryPageProps = { params: Promise<{ slug: string }> };

export default async function CountryPage({ params }: CountryPageProps) {
  const { slug } = await params;
  const countryCode = getIdFromSlug(slug);

  const movieFilters: MovieSearchType = {
    page: DEFAULT_PAGE_START,
    country: countryCode,
    size: DEFAULT_PAGE_SIZE
  };

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.MOVIE_LIST, movieFilters],
    queryFn: () => movieApiRequest.getList(movieFilters)
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
