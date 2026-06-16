import { Activity } from '@/components/activity';
import { Badge } from '@/components/ui/badge';
import {
  DATE_TIME_FORMAT,
  GENDER_FEMALE,
  GENDER_MALE,
  GENDER_OTHER
} from '@/constants';
import { cn } from '@/lib';
import { CommentResType, ProfileResType } from '@/types';
import { convertUTCToLocal, timeAgo } from '@/utils';
import { Pin } from 'lucide-react';
import { ComponentType } from 'react';

type CommentHeaderProps = {
  comment: CommentResType;
  isAuthor: boolean;
  kind:
    | {
        label: string;
        style: string;
      }
    | undefined;
  gender: number;
  GenderIcon: ComponentType<{ className?: string }>;
  author: ProfileResType;
  movieItem: CommentResType['movieItem'];
};

export function CommentHeader({
  comment,
  isAuthor,
  kind,
  gender,
  GenderIcon,
  author,
  movieItem
}: CommentHeaderProps) {
  return (
    <div className='max-640:gap-1 max-768:gap-1.5 relative flex items-center justify-start gap-2'>
      <div className='max-640:gap-x-1 flex items-center gap-x-2'>
        {kind && (
          <Badge
            variant='outline'
            className={cn(
              'max-640:text-xs max-520:text-[10px] max-640:px-1 border text-sm font-medium uppercase',
              kind.style
            )}
          >
            {kind.label}
          </Badge>
        )}
        <div className='max-640:text-[13px] flex items-center'>
          <span className='max-990:max-w-90 max-800:max-w-80 max-768:max-w-70 max-720:max-w-50 max-640:max-w-45 max-480:max-w-40 max-420:max-w-20 line-clamp-1 block max-w-125 truncate'>
            {author.fullName}
          </span>
          {isAuthor && (
            <span className='max-640:hidden text-golden-glow font-semibold'>
              &nbsp;(Bạn)
            </span>
          )}
        </div>

        <GenderIcon
          className={cn('max-640:size-3 size-4', {
            'text-cyan-500': gender === GENDER_MALE,
            'text-pink-500': gender === GENDER_FEMALE,
            'text-golden-glow': gender === GENDER_OTHER
          })}
        />
      </div>
      <span
        title={convertUTCToLocal(comment.createdDate, DATE_TIME_FORMAT)}
        className='max-640:hidden whitespace-nowrap text-gray-400'
      >
        {timeAgo(comment.createdDate)}
      </span>
      {movieItem && movieItem.parent && (
        <Badge
          variant='outline'
          className='max-640:px-1.5 max-640:py-0.5 max-480:text-[10px] border px-2 py-1 text-xs font-medium whitespace-nowrap text-gray-400'
          title={`Phần ${movieItem.parent.label} - Tập ${movieItem.label}`}
        >
          P. {movieItem.parent.label} - T. {movieItem.label}
        </Badge>
      )}
      <Activity visible={comment.createdDate !== comment.modifiedDate}>
        <span
          title={convertUTCToLocal(comment.modifiedDate, DATE_TIME_FORMAT)}
          className='max-640:text-[13px] max-520:text-xs whitespace-nowrap text-gray-400'
        >
          (đã cập nhật)
        </span>
      </Activity>
      <Activity visible={comment.isPinned}>
        <span title='Đã ghim' className='ml-auto'>
          <Pin className='text-golden-glow fill-golden-glow size-5 rotate-45' />
        </span>
      </Activity>
    </div>
  );
}
