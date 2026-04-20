import { categoryApiRequest, movieApiRequest } from '@/api-requests';
import { Container } from '@/components/layout';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_START, queryKeys } from '@/constants';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getIdFromSlug } from '@/utils';
import { getQueryClient } from '@/components/providers/query-provider';
import { MovieList } from '@/app/category/[slug]/_components';
import { MovieSearchType } from '@/types';
import type { Metadata } from 'next';
import envConfig from '@/config';

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
  const description = `Khám phá danh sách phim ${categoryName.toLowerCase()} mới nhất trên MovieHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${envConfig.NEXT_PUBLIC_URL}/category/${slug}`,
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title,
      description
    },
    alternates: {
      canonical: `${envConfig.NEXT_PUBLIC_URL}/category/${slug}`
    }
  };
}

type CategoryPageProps = { params: Promise<{ slug: string }> };

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const id = getIdFromSlug(slug);
  const movieFilters: MovieSearchType = {
    page: DEFAULT_PAGE_START,
    size: DEFAULT_PAGE_SIZE,
    categoryIds: id
  };
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [queryKeys.CATEGORY, id],
      queryFn: () => categoryApiRequest.getById(id)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_LIST, movieFilters],
      queryFn: () => movieApiRequest.getList(movieFilters)
    })
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
        <div className='max-640:gap-8 flex flex-col gap-12.5'>
          <MovieList id={id} />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
