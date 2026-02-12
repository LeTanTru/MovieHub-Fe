import { commentApiRequest } from '@/api-requests';
import { DEFALT_PAGE_START, DEFAULT_PAGE_SIZE, queryKeys } from '@/constants';
import {
  ApiResponseList,
  CommentResType,
  CommentSearchType,
  CreateCommentBodyType,
  UpdateCommentBodyType,
  VoteCommentBodyType
} from '@/types';
import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery
} from '@tanstack/react-query';

export const useCommentListQuery = ({
  params,
  enabled
}: {
  params?: CommentSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.COMMENT_LIST, params],
    queryFn: () => commentApiRequest.getList({ params }),
    enabled
  });
};

export const useInfiniteCommentListQuery = ({
  params,
  queryKey,
  enabled
}: {
  params: CommentSearchType;
  queryKey: string;
  enabled?: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: [queryKey, params],
    queryFn: ({ pageParam }) =>
      commentApiRequest.getList({
        params: { ...params, page: pageParam }
      }),
    initialPageParam: DEFALT_PAGE_START,
    getNextPageParam: (lastPage, pages) => {
      const totalPages = lastPage?.data?.totalPages || 0;
      const nextPage = pages.length;

      return nextPage < totalPages ? nextPage : undefined;
    },
    enabled: enabled
  });
};

export const useCreateCommentMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.CREATE_COMMENT],
    mutationFn: (body: CreateCommentBodyType) => commentApiRequest.create(body)
  });
};

export const useDeleteCommentMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.DELETE_COMMENT],
    mutationFn: (id: string) => commentApiRequest.delete(id)
  });
};

export const useUpdateCommentMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.UPDATE_COMMENT],
    mutationFn: (body: UpdateCommentBodyType) => commentApiRequest.update(body)
  });
};

export const useVoteCommentMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.VOTE_COMMENT],
    mutationFn: (body: VoteCommentBodyType) => commentApiRequest.vote(body)
  });
};

export const useVoteCommentListQuery = ({
  movieId,
  enabled
}: {
  movieId: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.COMMENT_VOTE_LIST, movieId],
    queryFn: () => commentApiRequest.getVoteList(movieId),
    enabled
  });
};

export type CommentRepliesData = {
  parentId: string;
  replies: CommentResType[];
  isLoading: boolean;
  isFetching: boolean;
  hasNextPage: boolean;
  totalPages: number;
  currentPage: number;
  dataUpdatedAt: number;
};

export const useCommentRepliesQueries = ({
  movieId,
  parentIds,
  pageMap = {},
  enabled = true
}: {
  movieId: string;
  parentIds: string[];
  pageMap?: Record<string, number>;
  enabled?: boolean;
}) => {
  const queries = useQueries({
    queries: parentIds.map((parentId) => ({
      queryKey: [
        `${queryKeys.COMMENT_LIST}-replies-${parentId}`,
        { movieId, parentId, page: pageMap[parentId] || DEFALT_PAGE_START }
      ],
      queryFn: () =>
        commentApiRequest.getList({
          params: {
            movieId,
            parentId,
            page: pageMap[parentId] || DEFALT_PAGE_START,
            size: DEFAULT_PAGE_SIZE
          }
        }),
      enabled: enabled && Boolean(parentId) && Boolean(movieId)
    }))
  });

  const repliesMap: Record<string, CommentRepliesData> = {};

  parentIds.forEach((parentId, index) => {
    const query = queries[index];
    const data = query?.data as ApiResponseList<CommentResType> | undefined;
    repliesMap[parentId] = {
      parentId,
      replies: (data?.data?.content || []).filter((item) => Boolean(item?.id)),
      isLoading: query?.isLoading ?? false,
      isFetching: query?.isFetching ?? false,
      hasNextPage:
        (data?.data?.totalPages || 0) >
        (pageMap[parentId] || DEFALT_PAGE_START) + 1,
      totalPages: data?.data?.totalPages || 0,
      currentPage: pageMap[parentId] || DEFALT_PAGE_START,
      dataUpdatedAt: query?.dataUpdatedAt ?? 0
    };
  });

  return {
    repliesMap,
    queries,
    isLoading: queries.some((q) => q.isLoading),
    isFetching: queries.some((q) => q.isFetching)
  };
};
