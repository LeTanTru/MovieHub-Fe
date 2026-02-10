import { ReviewStoreType } from '@/types';
import { create } from 'zustand';

const useReviewStore = create<ReviewStoreType>((set) => ({
  selectedReview: null,
  setSelectedReview: (review) => set({ selectedReview: review })
}));

export default useReviewStore;
