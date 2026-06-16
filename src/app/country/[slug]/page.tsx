import {
  countries,
  DEFAULT_PAGE_START,
  DEFAULT_PAGE_SIZE,
  queryKeys,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT
} from '@/constants';
import { Metadata } from 'next';
import { generateSlug, getIdFromSlug } from '@/utils';
import { MovieSearchType, ApiResponseList, MovieResType } from '@/types';
import { getQueryClient } from '@/components/providers/query-provider';
import { movieApiRequest } from '@/api-requests';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { MovieList } from '@/app/country/[slug]/_components';
import { Container } from '@/components/layout';
import { BreadcrumbListJsonLd, ItemListJsonLd } from '@/components/seo';
import { envConfig } from '@/config';

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
      canonical: `/country/${slug}`
    }
  };
}

type CountryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function CountryPage({
  params,
  searchParams
}: CountryPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const countryCode = getIdFromSlug(slug);
  const countryName =
    countries.find((country) => country.value === countryCode)?.label ||
    'quốc gia';

  const movieFilters: MovieSearchType = {
    page: page ? Number(page) - 1 : DEFAULT_PAGE_START,
    country: countryCode,
    size: DEFAULT_PAGE_SIZE
  };

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.MOVIE_LIST, movieFilters],
    queryFn: ({ signal }) => movieApiRequest.getList(movieFilters, signal)
  });

  const moviesRes = queryClient.getQueryData<ApiResponseList<MovieResType>>([
    queryKeys.MOVIE_LIST,
    movieFilters
  ]);
  const movies = moviesRes?.data.content || [];

  const breadcrumbLd = {
    items: [
      { name: 'Trang chủ', item: envConfig.NEXT_PUBLIC_URL },
      {
        name: 'Quốc gia',
        item: `${envConfig.NEXT_PUBLIC_URL}/country`
      },
      {
        name: countryName,
        item: `${envConfig.NEXT_PUBLIC_URL}/country/${slug}`
      }
    ]
  };

  const itemListLd = {
    items: movies.map((movie, index) => ({
      position: index + 1,
      url: `${envConfig.NEXT_PUBLIC_URL}/movie/${movie.slug}.${movie.id}`,
      name: movie.title
    })),
    itemListName: `Phim ${countryName}`
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BreadcrumbListJsonLd items={breadcrumbLd.items} />
      {itemListLd.items.length > 0 && <ItemListJsonLd {...itemListLd} />}
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
        <div className='max-640:gap-8 flex flex-col gap-12.5'>
          <MovieList countryCode={countryCode} />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
