import { CommentStoreType } from '@/types';
import { create } from 'zustand';

const useCommentStore = create<CommentStoreType>((set) => ({
  comment: null,

  setComment: (comment) => set(() => ({ comment }))
}));

export default useCommentStore;
