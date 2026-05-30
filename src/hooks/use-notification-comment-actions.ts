'use client';

import { useCommentStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export const useNotificationCommentActions = () =>
  useCommentStore(
    useShallow((s) => ({
      setOpenParentIds: s.setOpenParentIds,
      setScrollTarget: s.setScrollTarget
    }))
  );
