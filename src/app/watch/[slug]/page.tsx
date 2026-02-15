import {
  commentApiRequest,
  movieApiRequest,
  moviePersonApiRequest,
  reviewApiRequest
} from '@/api-requests';
import { Watch } from '@/app/watch/[slug]/_components';
import { getQueryClient } from '@/components/providers';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_TABLE_PAGE_START,
  queryKeys
} from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  CommentResType,
  CommentSearchType,
  MoviePersonSearchType,
  ReviewResType
} from '@/types';
import { getIdFromSlug } from '@/utils';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Xem phim'
};

export default async function WatchPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = getIdFromSlug(slug);

  const moviePersonFilters: MoviePersonSearchType = {
    movieId: id
  };

  const commentFilters: CommentSearchType = {
    movieId: id,
    size: DEFAULT_PAGE_SIZE
  };

  const reviewFilters: CommentSearchType = {
    movieId: id,
    size: DEFAULT_PAGE_SIZE
  };

  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE, id],
      queryFn: () => movieApiRequest.getById(id)
    });

    const movieData: ApiResponse<any> | undefined = queryClient.getQueryData([
      queryKeys.MOVIE,
      id
    ]);

    if (!movieData?.result) {
      notFound();
    }
  } catch (_) {
    notFound();
  }

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.MOVIE_PERSON_LIST, moviePersonFilters],
    queryFn: () => moviePersonApiRequest.getList({ params: moviePersonFilters })
  });

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.MOVIE_SUGGESTION_LIST, id],
    queryFn: () => movieApiRequest.getSuggestionList(id)
  });

  await queryClient.prefetchInfiniteQuery({
    queryKey: [queryKeys.COMMENT_LIST, commentFilters],
    queryFn: ({ pageParam }) =>
      commentApiRequest.getList({
        params: {
          movieId: id,
          page: pageParam,
          size: DEFAULT_PAGE_SIZE
        }
      }),
    initialPageParam: DEFAULT_TABLE_PAGE_START,
    getNextPageParam: (
      lastPage: ApiResponseList<CommentResType>,
      pages: ApiResponseList<CommentResType>[]
    ) => (pages.length < lastPage.data.totalPages ? pages.length : undefined)
  });

  await queryClient.prefetchInfiniteQuery({
    queryKey: [queryKeys.REVIEW_LIST, reviewFilters],
    queryFn: ({ pageParam }) =>
      reviewApiRequest.getList({
        params: {
          movieId: id,
          page: pageParam,
          size: DEFAULT_PAGE_SIZE
        }
      }),
    initialPageParam: DEFAULT_TABLE_PAGE_START,
    getNextPageParam: (
      lastPage: ApiResponseList<ReviewResType>,
      pages: ApiResponseList<ReviewResType>[]
    ) => (pages.length < lastPage.data.totalPages ? pages.length : undefined)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Watch id={id} />
    </HydrationBoundary>
  );
}
