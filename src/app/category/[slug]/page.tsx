import { categoryApiRequest, movieApiRequest } from '@/api-requests';
import type { Metadata } from 'next';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_START, queryKeys } from '@/constants';
import { getQueryClient } from '@/components/providers';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ApiResponse, MovieSearchType } from '@/types';
import { MovieList } from '@/app/category/[slug]/_components';
import { getIdFromSlug } from '@/utils';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout';

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

  return {
    title: category?.name || 'Danh mục'
  };
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = getIdFromSlug(slug);
  const defaultFilters: MovieSearchType = {
    page: DEFAULT_PAGE_START,
    size: DEFAULT_PAGE_SIZE,
    categoryIds: id
  };
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: [queryKeys.CATEGORY, id],
      queryFn: () => categoryApiRequest.getById(id)
    });

    const categoryData: ApiResponse<any> | undefined = queryClient.getQueryData(
      [queryKeys.CATEGORY, id]
    );

    if (!categoryData?.result) {
      notFound();
    }
  } catch (_) {
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
          <MovieList id={id} />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
