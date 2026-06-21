'use client';

import { AvatarField } from '@/components/form';
import {
  GENDER_OTHER,
  genderIconMaps,
  kindMaps,
  STATUS_HIDE
} from '@/constants';
import { useClickOutside } from '@/hooks';
import { cn } from '@/lib';
import { ReviewResType, ToxicSpan } from '@/types';
import { parseJSON, renderImageUrl } from '@/utils';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Element, scroller } from 'react-scroll';
import { ReviewAction } from './review-action';
import { ReviewContent } from './review-content';
import { ReviewHeader } from './review-header';
import { Skeleton } from '@/components/ui/skeleton';
import { StaticImageData } from 'next/image';

const SCROLL_DELAY = 100;
const HIGHLIGHT_DURATION = 2000;

type ReviewItemProps = {
  review: ReviewResType;
  reviewRatingMaps: Record<number, { label: string; icon: StaticImageData }>;
  isAuthor: boolean;
  canDelete: boolean;
  canReport: boolean;
  canVote: boolean;
  voteType: number;
  onVote: (id: string, type: number) => void;
  onDelete: (id: string) => void;
  onOpenReportModal: (reviewId: string) => void;
  targetReviewId: string | null;
  clearScrollTarget: () => void;
};

export function ReviewItem({
  review,
  reviewRatingMaps,
  isAuthor,
  canDelete,
  canReport,
  canVote,
  voteType,
  onVote,
  onDelete,
  onOpenReportModal,
  targetReviewId,
  clearScrollTarget
}: ReviewItemProps) {
  const author = review.author;
  const gender = author.gender || GENDER_OTHER;
  const kind = author.kind !== undefined ? kindMaps[author.kind] : undefined;
  const rate = review.rate;
  const ratingInfo = rate !== undefined ? reviewRatingMaps[rate] : null;
  const GenderIcon = genderIconMaps[gender];

  const isHidden = review.status === STATUS_HIDE;

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() =>
    setShowDropdown(false)
  );
  const toxicSpans = review.toxicSpans
    ? parseJSON<ToxicSpan[]>(review.toxicSpans) || []
    : [];
  const hasToxicSpans = toxicSpans.length > 0;
  const [isVisible, setIsVisible] = useState(false);
  const canViewHiddenContent = isHidden || !!hasToxicSpans;
  const isBlurWholeContent = isHidden && !isVisible && !hasToxicSpans;

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  const renderContent = () => {
    const content = review.content;

    if (!hasToxicSpans) return content;

    const result: ReactNode[] = [];
    let lastIndex = 0;

    toxicSpans.forEach((span, index) => {
      const start = Math.min(Math.max(span.start, lastIndex), content.length);
      const end = Math.min(Math.max(span.end, start), content.length);

      if (start > lastIndex) {
        result.push(content.slice(lastIndex, start));
      }

      if (start === end) {
        lastIndex = start;
        return;
      }

      result.push(
        <span
          className={cn({ 'blur-xs select-none': !isVisible })}
          key={`${start}-${end}-${index}`}
        >
          {content.slice(start, end)}
        </span>
      );

      lastIndex = end;
    });

    result.push(content.slice(lastIndex));

    return result;
  };

  const handleViewContent = () => {
    setIsVisible((prev) => !prev);
    setShowDropdown(false);
  };

  const handleDeleteReview = () => {
    setShowDropdown(false);
    onDelete(review.id);
  };

  const handleOpenReportModal = () => {
    setShowDropdown(false);
    onOpenReportModal(review.id);
  };

  const scrollTargetName = useMemo(() => `review-${review.id}`, [review.id]);
  const [isScrollTarget, setIsScrollTarget] = useState(false);

  useEffect(() => {
    if (targetReviewId !== review.id) return;

    let clearHighlightTimeout: NodeJS.Timeout | null = null;

    const scrollTimeout = setTimeout(() => {
      scroller.scrollTo(scrollTargetName, {
        duration: 500,
        smooth: 'easeInOutQuart',
        offset: -250
      });

      setIsScrollTarget(true);
      clearHighlightTimeout = setTimeout(() => {
        setIsScrollTarget(false);
        clearScrollTarget();
      }, HIGHLIGHT_DURATION);
    }, SCROLL_DELAY);

    return () => {
      setIsScrollTarget(false);
      clearTimeout(scrollTimeout);
      if (clearHighlightTimeout) {
        clearTimeout(clearHighlightTimeout);
      }
    };
  }, [clearScrollTarget, review.id, scrollTargetName, targetReviewId]);

  return (
    <Element name={scrollTargetName}>
      <div
        className={cn(
          'max-640:gap-3 max-520:gap-2 relative flex justify-start gap-4',
          {
            'bg-charade rounded-lg transition-colors duration-200 ease-linear':
              isScrollTarget
          }
        )}
      >
        <AvatarField
          src={renderImageUrl(author?.avatarPath)}
          size={45}
          alt={author?.fullName}
          breakpoints={[{ breakpoint: 640, size: 50 }]}
        />
        <div className='grow'>
          <ReviewHeader
            review={review}
            isAuthor={isAuthor}
            kind={kind}
            gender={gender}
            GenderIcon={GenderIcon}
            author={author}
            ratingInfo={ratingInfo}
          />

          <ReviewContent
            canViewHiddenContent={canViewHiddenContent}
            isBlurWholeContent={isBlurWholeContent}
            onToggleBlurredContent={handleViewContent}
            renderContent={renderContent}
          />

          <ReviewAction
            review={review}
            isHidden={isHidden}
            canDelete={canDelete && isAuthor}
            canReport={canReport && !isAuthor}
            canVote={canVote}
            isVisible={isVisible}
            showDropdown={showDropdown}
            voteType={voteType}
            dropdownRef={dropdownRef}
            onVote={onVote}
            onToggleDropdown={handleDropdownToggle}
            onToggleBlurredContent={handleViewContent}
            onDelete={handleDeleteReview}
            onOpenReportModal={handleOpenReportModal}
          />
        </div>
      </div>
    </Element>
  );
}

ReviewItem.Skeleton = () => {
  return (
    <div className='max-640:gap-3 max-520:gap-2 relative flex justify-start gap-4'>
      <Skeleton className='skeleton size-11.25 shrink-0 rounded-full! sm:size-12.5' />
      <div className='grow'>
        {/* Header */}
        <div className='flex h-6.5 items-center gap-2 sm:h-7.5'>
          <Skeleton className='skeleton h-4 w-20' />
          <Skeleton className='skeleton h-4 w-24' />
        </div>
        {/* Content */}
        <div className='mt-2 space-y-2'>
          <Skeleton className='skeleton h-4 w-full' />
          <Skeleton className='skeleton h-4 w-3/4' />
        </div>
        {/* Action */}
        <div className='max-640:mt-3 mt-4 flex items-center gap-4'>
          <Skeleton className='skeleton h-4 w-10' />
          <Skeleton className='skeleton h-4 w-10' />
          <Skeleton className='skeleton h-4 w-14' />
        </div>
      </div>
    </div>
  );
};
