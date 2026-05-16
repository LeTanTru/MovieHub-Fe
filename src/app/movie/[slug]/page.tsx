import {
  commentApiRequest,
  movieApiRequest,
  moviePersonApiRequest,
  reviewApiRequest
} from '@/api-requests';
import { Movie } from '@/app/movie/[slug]/_components';
import { getQueryClient } from '@/components/providers/query-provider';
import envConfig from '@/config';
import {
  AppConstants,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_START,
  queryKeys
} from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  CommentResType,
  CommentSearchType,
  MoviePersonSearchType,
  MovieResType,
  MovieSearchType,
  ReviewResType,
  ReviewSearchType
} from '@/types';
import { JsonLd } from '@/components/seo';
import { getIdFromSlug, sanitizeText, stripHtml, truncate } from '@/utils';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 60;

export async function generateStaticParams() {
  const movies = await movieApiRequest.getList({
    size: DEFAULT_PAGE_SIZE
  });
  return movies.data.content.map((movie) => ({
    slug: `${movie.slug}.${movie.id}`
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const id = getIdFromSlug(slug);

  const res = await movieApiRequest.getById(id);
  const title = res.data
    ? `Phim ${res.data?.title} - ${res.data?.originalTitle}`
    : 'Không tìm thấy phim';
  const description = truncate(
    stripHtml(res.data?.description || 'Thông tin phim'),
    160
  );

  const previousImages = (await parent).openGraph?.images || [];
  const images = res.data?.posterUrl
    ? [
        {
          url: `${AppConstants.contentRootUrl}${res.data.posterUrl}`,
          width: 1200,
          height: 630,
          alt: title
        },
        ...previousImages
      ]
    : previousImages;

  return {
    title,
    description,
    metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
    keywords: res.data
      ? [res.data.title, res.data.originalTitle || '', 'xem phim', 'phim hay']
      : ['xem phim', 'phim moviehub'],
    openGraph: {
      type: 'video.movie',
      title,
      description,
      images,
      url: `/movie/${slug}`
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images
    },
    alternates: {
      canonical: `/movie/${slug}`
    }
  };
}

type MoviePageProps = { params: Promise<{ slug: string }> };

export default async function MoviePage({ params }: MoviePageProps) {
  const { slug } = await params;
  const id = getIdFromSlug(slug);

  const moviePersonFilters: MoviePersonSearchType = {
    movieId: id
  };

  const commentFilters: CommentSearchType = {
    movieId: id,
    size: DEFAULT_PAGE_SIZE
  };

  const reviewFilters: ReviewSearchType = {
    movieId: id,
    size: DEFAULT_PAGE_SIZE
  };

  const topViewFilters: MovieSearchType = {};

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE, id],
      queryFn: () => movieApiRequest.getById(id)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_PERSON_LIST, moviePersonFilters],
      queryFn: () => moviePersonApiRequest.getList(moviePersonFilters)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_SUGGESTION_LIST, id],
      queryFn: () => movieApiRequest.getSuggestionList(id)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_TOP_VIEW_LIST, topViewFilters],
      queryFn: () => movieApiRequest.getTopViewList(topViewFilters)
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: [queryKeys.COMMENT_LIST, commentFilters],
      queryFn: ({ pageParam }) =>
        commentApiRequest.getList({
          movieId: id,
          page: pageParam,
          size: DEFAULT_PAGE_SIZE
        }),
      initialPageParam: DEFAULT_PAGE_START,
      getNextPageParam: (
        lastPage: ApiResponseList<CommentResType>,
        pages: ApiResponseList<CommentResType>[]
      ) => (pages.length < lastPage.data.totalPages ? pages.length : undefined)
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: [queryKeys.REVIEW_LIST, reviewFilters],
      queryFn: ({ pageParam }) =>
        reviewApiRequest.getList({
          movieId: id,
          page: pageParam,
          size: DEFAULT_PAGE_SIZE
        }),
      initialPageParam: DEFAULT_PAGE_START,
      getNextPageParam: (
        lastPage: ApiResponseList<ReviewResType>,
        pages: ApiResponseList<ReviewResType>[]
      ) => (pages.length < lastPage.data.totalPages ? pages.length : undefined)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_NEXT_EPISODE, id],
      queryFn: () => movieApiRequest.getNextEpisode(id)
    })
  ]);

  const movieRes = queryClient.getQueryData<ApiResponse<MovieResType>>([
    queryKeys.MOVIE,
    id
  ]);
  const movie = movieRes?.data;
  const jsonLd = movie
    ? {
        '@context': 'https://schema.org',
        '@type': 'Movie',
        name: movie.title,
        alternateName: movie.originalTitle,
        image: movie.posterUrl
          ? `${AppConstants.contentRootUrl}${movie.posterUrl}`
          : undefined,
        description: sanitizeText(movie.description || ''),
        dateCreated: movie.createdDate
      }
    : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {jsonLd && <JsonLd data={jsonLd} />}
      <Movie id={id} />
    </HydrationBoundary>
  );
}
