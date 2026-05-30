'use client';

import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export const useDiscussionTab = () =>
  useMovieStore(useShallow((s) => ({ setDiscussionTab: s.setDiscussionTab })));
