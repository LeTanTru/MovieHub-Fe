import { DEFAULT_PAGE_START } from '@/constants';
import { ApiResponseList, BaseSearchType } from '@/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';

type LoadMoreMode = 'scroll' | 'click' | 'both';

/**
 * Props for the `useLoadMore` hook.
 *
 * @template S - The search/query params type, extending `BaseSearchType`.
 * @template R - The type of a single item in the response list.
 *
 * @param queryKey - Unique key used to identify and cache the infinite query.
 * @param params - Query parameters forwarded to `queryFn` on each page fetch.
 * @param queryFn - Async function that fetches a page of results given `params` and an optional `AbortSignal`.
 * @param enabled - When `false`, the query is disabled and no requests are made. Defaults to `true`.
 * @param mode - Controls how additional pages are triggered.
 *   - `'scroll'` (default) — automatically fetches the next page when the sentinel element enters the viewport.
 *   - `'click'` — only fetches the next page when `handleLoadMore` is called explicitly.
 *   - `'both'` — supports both scroll-based and manual triggering.
 * @param threshold - `IntersectionObserver` threshold (0–1) that determines how much of the sentinel element
 *   must be visible before the next page is fetched. Only used in `'scroll'` and `'both'` modes. Defaults to `1`.
 */
type UseLoadMoreProps<S extends BaseSearchType, R> = {
  queryKey: string;
  params: S;
  queryFn: (params: S, signal?: AbortSignal) => Promise<ApiResponseList<R>>;
  enabled?: boolean;
  mode?: LoadMoreMode;
  threshold?: number;
};

/**
 * Hook for infinite-scroll / load-more pagination backed by TanStack Query.
 *
 * @template T - The HTML element type of the scroll sentinel ref (e.g. `HTMLDivElement`).
 * @template S - The search/query params type, extending `BaseSearchType`.
 * @template R - The type of a single item in the response list.
 *
 * @param queryKey - Unique key used to identify and cache the infinite query.
 * @param params - Query parameters forwarded to `queryFn` on each page fetch.
 * @param queryFn - Async function that fetches a page of results given `params` and an optional `AbortSignal`.
 * @param enabled - When `false`, the query is disabled and no requests are made. Defaults to `true`.
 * @param mode - Trigger mode for loading more pages (`'scroll'` | `'click'` | `'both'`). Defaults to `'scroll'`.
 * @param threshold - IntersectionObserver visibility threshold (0–1) for the sentinel element. Defaults to `1`.
 *
 * @returns An object containing:
 * - `data` — Flattened array of all fetched items across pages.
 * - `hasMore` — Whether a next page is available.
 * - `isLoadingMore` — Whether the next page is currently being fetched.
 * - `isLoading` — Whether the initial page load is in progress.
 * - `loadMoreRef` — Ref to attach to the sentinel element for scroll-based triggering.
 * - `remainingElements` — Number of items not yet loaded (`totalElements - data.length`).
 * - `totalElements` — Total number of items reported by the first page response.
 * - `handleLoadMore` — Callback to manually trigger fetching the next page (used in `'click'` or `'both'` modes).
 */
export const useLoadMore = <
  T extends HTMLElement,
  S extends BaseSearchType,
  R
>({
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
      queryFn: ({ pageParam, signal }) =>
        queryFn({ ...params, page: pageParam }, signal),
      initialPageParam: DEFAULT_PAGE_START,
      getNextPageParam: (lastPage, pages) => {
        const totalPages = lastPage?.data?.totalPages || 0;
        const nextPage = pages.length;

        return nextPage < totalPages ? nextPage : undefined;
      },
      enabled
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

  const dataList = (
    data?.pages?.flatMap((page) => page.data?.content) || []
  )?.filter(Boolean);
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
