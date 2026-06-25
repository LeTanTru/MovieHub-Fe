import { categoryApiRequest, movieApiRequest } from '@/api-requests';
import { Container } from '@/components/layout';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_START,
  queryKeys,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT
} from '@/constants';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getIdFromSlug } from '@/utils';
import { getQueryClient } from '@/components/providers/query-provider';
import { MovieList } from '@/app/category/[slug]/_components';
import { ApiResponseList, MovieResType, MovieSearchType } from '@/types';
import { BreadcrumbListJsonLd, ItemListJsonLd } from '@/components/seo';
import type { Metadata } from 'next';
import { envConfig } from '@/config';

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await categoryApiRequest.getList({
    size: DEFAULT_PAGE_SIZE
  });
  return categories.data.content.map((category) => ({
    slug: `${category?.slug}.${category?.id}`
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = getIdFromSlug(slug);
  const res = await categoryApiRequest.getById(id);
  const category = res.data;
  const categoryName = category?.name || 'thể loại';
  const title = category?.name || 'Thể loại phim';
  const description = `Khám phá danh sách phim ${categoryName.toLowerCase()} mới nhất trên MovieHub. Tổng hợp đầy đủ các bộ phim thuộc thể loại ${categoryName.toLowerCase()} hay nhất, cập nhật liên tục với chất lượng cao.`;

  return {
    title,
    description,
    metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
    keywords: [
      categoryName,
      'thể loại phim',
      'phim moviehub',
      `phim ${categoryName.toLowerCase()}`
    ],
    openGraph: {
      title,
      description,
      url: `/category/${slug}`,
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
      canonical: `/category/${slug}`
    }
  };
}

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function CategoryPage({
  params,
  searchParams
}: CategoryPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const id = getIdFromSlug(slug);
  const movieFilters: MovieSearchType = {
    page: page ? Number(page) - 1 : DEFAULT_PAGE_START,
    size: DEFAULT_PAGE_SIZE,
    categoryIds: id
  };
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [queryKeys.CATEGORY, id],
      queryFn: ({ signal }) => categoryApiRequest.getById(id, signal)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_LIST, movieFilters],
      queryFn: ({ signal }) => movieApiRequest.getList(movieFilters, signal)
    })
  ]);

  const categoryRes = queryClient.getQueryData<{ data: { name: string } }>([
    queryKeys.CATEGORY,
    id
  ]);
  const categoryName = categoryRes?.data?.name || 'thể loại';

  const moviesRes = queryClient.getQueryData<ApiResponseList<MovieResType>>([
    queryKeys.MOVIE_LIST,
    movieFilters
  ]);
  const movies = moviesRes?.data.content || [];

  const breadcrumbLd = {
    items: [
      { name: 'Trang chủ', item: envConfig.NEXT_PUBLIC_URL },
      {
        name: 'Thể loại',
        item: `${envConfig.NEXT_PUBLIC_URL}/category`
      },
      {
        name: categoryName,
        item: `${envConfig.NEXT_PUBLIC_URL}/category/${slug}`
      }
    ]
  };

  const itemListLd = {
    items: movies.map((movie, index) => ({
      position: index + 1,
      url: `${envConfig.NEXT_PUBLIC_URL}/movie/${movie.slug}.${movie.id}`,
      name: movie.title
    })),
    itemListName: `Phim ${categoryName}`
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BreadcrumbListJsonLd items={breadcrumbLd.items} />
      {itemListLd.items.length > 0 && <ItemListJsonLd {...itemListLd} />}
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 min-h-page-height relative py-40'>
        <div className='max-640:gap-8 flex flex-col gap-12.5'>
          <MovieList id={id} />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
