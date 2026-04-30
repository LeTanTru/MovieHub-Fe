import { DEFAULT_PAGE_START } from '@/constants';
import { ApiResponse, ApiResponseList, BaseSearchType } from '@/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';

type LoadMoreMode = 'scroll' | 'click' | 'both';

type UseLoadMoreProps<S extends BaseSearchType, R> = {
  queryKey: string;
  params: S;
  queryFn: (params: S) => Promise<ApiResponseList<R> | ApiResponse<R>>;
  enabled?: boolean;
  mode?: LoadMoreMode;
  threshold?: number;
};

const useLoadMore = <T extends HTMLElement, S extends BaseSearchType, R>({
  queryKey,
  params,
  queryFn,
  enabled,
  mode = 'scroll',
  threshold = 1
}: UseLoadMoreProps<S, R>) => {
  const loadMoreRef = useRef<T | null>(null);

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [queryKey, params],
      queryFn: ({ pageParam }) => queryFn({ ...params, page: pageParam }),
      initialPageParam: DEFAULT_PAGE_START,
      getNextPageParam: (lastPage, pages) => {
        const listPage = lastPage as ApiResponseList<R> | ApiResponse<R>;
        if (!('totalPages' in (listPage.data || {}))) {
          return undefined;
        }
        const totalPages =
          (listPage as ApiResponseList<R>).data?.totalPages || 0;
        const nextPage = pages.length;

        return nextPage < totalPages ? nextPage : undefined;
      },
      enabled: enabled
    });

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    // Only set up observer for 'scroll' or 'both' modes
    if (mode === 'click') return;
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold }
    );

    const currentRef = loadMoreRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, mode, threshold]);

  const dataList =
    data?.pages
      ?.flatMap((page) => {
        if (!page) return [];
        const listPage = page as ApiResponseList<R>;
        if (listPage.data?.content) {
          return listPage.data.content;
        }
        const singlePage = page as ApiResponse<R>;
        if (singlePage.data) {
          return [singlePage.data as R];
        }
        return [];
      })
      ?.filter(Boolean) || [];
  const totalElements =
    (data?.pages?.[0] as ApiResponseList<R>)?.data?.totalElements ||
    ('totalElements' in ((data?.pages?.[0] as ApiResponse<R>)?.data || {})
      ? 1
      : 0);

  return {
    data: dataList,
    fetchNextPage,
    handleLoadMore,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoading,
    loadMoreRef,
    totalElements
  };
};

export default useLoadMore;
