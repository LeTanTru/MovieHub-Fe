import {
  commentApiRequest,
  movieApiRequest,
  moviePersonApiRequest,
  reviewApiRequest
} from '@/api-requests';
import { Movie } from '@/app/movie/[slug]/_components';
import { getQueryClient } from '@/components/providers/query-provider';
import { envConfig } from '@/config';
import {
  AppConstants,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_START,
  MAX_PAGE_SIZE,
  PERSON_KIND_ACTOR,
  PERSON_KIND_DIRECTOR,
  queryKeys
} from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  CommentResType,
  CommentSearchType,
  MetadataType,
  MoviePersonResType,
  MoviePersonSearchType,
  MovieResType,
  MovieSearchType,
  ReviewResType,
  ReviewSearchType
} from '@/types';
import { JsonLd, BreadcrumbListJsonLd } from '@/components/seo';
import {
  getIdFromSlug,
  parseJSON,
  sanitizeText,
  stripHtml,
  truncate
} from '@/utils';
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
    movieId: id,
    size: MAX_PAGE_SIZE
  };

  const actorFilters: MoviePersonSearchType = {
    movieId: id,
    kind: PERSON_KIND_ACTOR,
    size: MAX_PAGE_SIZE
  };

  const directorFilters: MoviePersonSearchType = {
    movieId: id,
    kind: PERSON_KIND_DIRECTOR,
    size: MAX_PAGE_SIZE
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
      queryFn: ({ signal }) => movieApiRequest.getById(id, signal)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_PERSON_LIST, moviePersonFilters],
      queryFn: ({ signal }) =>
        moviePersonApiRequest.getList(moviePersonFilters, signal)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_PERSON_LIST, actorFilters],
      queryFn: ({ signal }) =>
        moviePersonApiRequest.getList(actorFilters, signal)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_PERSON_LIST, directorFilters],
      queryFn: ({ signal }) =>
        moviePersonApiRequest.getList(directorFilters, signal)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_SUGGESTION_LIST, id],
      queryFn: ({ signal }) => movieApiRequest.getSuggestionList(id, signal)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_TOP_VIEW_LIST, topViewFilters],
      queryFn: ({ signal }) =>
        movieApiRequest.getTopViewList(topViewFilters, signal)
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: [queryKeys.COMMENT_LIST, commentFilters],
      queryFn: ({ pageParam, signal }) =>
        commentApiRequest.getList(
          {
            movieId: id,
            page: pageParam,
            size: DEFAULT_PAGE_SIZE
          },
          signal
        ),
      initialPageParam: DEFAULT_PAGE_START,
      getNextPageParam: (
        lastPage: ApiResponseList<CommentResType>,
        pages: ApiResponseList<CommentResType>[]
      ) => (pages.length < lastPage.data.totalPages ? pages.length : undefined)
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: [queryKeys.REVIEW_LIST, reviewFilters],
      queryFn: ({ pageParam, signal }) =>
        reviewApiRequest.getList(
          {
            movieId: id,
            page: pageParam,
            size: DEFAULT_PAGE_SIZE
          },
          signal
        ),
      initialPageParam: DEFAULT_PAGE_START,
      getNextPageParam: (
        lastPage: ApiResponseList<ReviewResType>,
        pages: ApiResponseList<ReviewResType>[]
      ) => (pages.length < lastPage.data.totalPages ? pages.length : undefined)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_NEXT_EPISODE, id],
      queryFn: ({ signal }) => movieApiRequest.getNextEpisode(id, signal)
    })
  ]);

  const movieRes = queryClient.getQueryData<ApiResponse<MovieResType>>([
    queryKeys.MOVIE,
    id
  ]);
  const movie = movieRes?.data;

  const allPersons =
    queryClient.getQueryData<ApiResponseList<MoviePersonResType>>([
      queryKeys.MOVIE_PERSON_LIST,
      moviePersonFilters
    ])?.data.content || [];

  const actors = allPersons.filter((p) => p.kind === PERSON_KIND_ACTOR);
  const directors = allPersons.filter((p) => p.kind === PERSON_KIND_DIRECTOR);

  const movieMetadata = movie
    ? parseJSON<MetadataType>(movie.metadata || '{}')
    : null;

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
        datePublished: movie.releaseDate || movie.createdDate,
        director: directors.map((d) => ({
          '@type': 'Person',
          name: d.person.otherName || d.person.name
        })),
        actor: actors.slice(0, 10).map((a) => ({
          '@type': 'Person',
          name: a.person.otherName || a.person.name,
          ...(a.characterName ? { characterName: a.characterName } : {})
        })),
        aggregateRating: movie.averageRating
          ? {
              '@type': 'AggregateRating',
              ratingValue: movie.averageRating,
              bestRating: 5,
              worstRating: 1,
              ratingCount: movie.reviewCount || 0
            }
          : undefined,
        genre: movie.categories.map((c) => c.name),
        duration: movieMetadata?.duration
          ? `PT${movieMetadata.duration}M`
          : undefined,
        url: `${envConfig.NEXT_PUBLIC_URL}/movie/${movie.slug}.${movie.id}`,
        sameAs: movie.viewCount ? undefined : undefined
      }
    : null;

  const breadcrumbLd = movie
    ? {
        items: [
          { name: 'Trang chủ', item: envConfig.NEXT_PUBLIC_URL },
          {
            name: 'Phim',
            item: `${envConfig.NEXT_PUBLIC_URL}/movie/single`
          },
          {
            name: movie.title,
            item: `${envConfig.NEXT_PUBLIC_URL}/movie/${movie.slug}.${movie.id}`
          }
        ]
      }
    : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {jsonLd && <JsonLd data={jsonLd} />}
      {breadcrumbLd && <BreadcrumbListJsonLd items={breadcrumbLd.items} />}
      <Movie id={id} />
    </HydrationBoundary>
  );
}
