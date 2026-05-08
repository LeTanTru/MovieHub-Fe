import { DEFAULT_PAGE_START } from '@/constants';
import { ApiResponseList, BaseSearchType } from '@/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';

type LoadMoreMode = 'scroll' | 'click' | 'both';

type UseLoadMoreProps<S extends BaseSearchType, R> = {
  queryKey: string;
  params: S;
  queryFn: (params: S) => Promise<ApiResponseList<R>>;
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
        const totalPages = lastPage?.data?.totalPages || 0;
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
    data?.pages?.flatMap((page) => page.data.content)?.filter(Boolean) || [];

  const totalElements = data?.pages?.[0]?.data?.totalElements || 0;

  const remainingElements = Math.max(totalElements - dataList.length, 0);

  return {
    data: dataList,
    hasMore: hasNextPage,
    isLoadingMore: isFetchingNextPage,
    isLoading,
    loadMoreRef,
    remainingElements,
    totalElements,
    handleLoadMore
  };
};

export default useLoadMore;
