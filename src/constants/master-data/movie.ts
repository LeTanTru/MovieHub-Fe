import {
  ratingBad,
  ratingBoring,
  ratingGood,
  ratingOk,
  ratingWonderful
} from '@/assets';
import {
  DISCUSSION_TAB_COMMENT,
  DISCUSSION_TAB_REVIEW,
  FAVOURITE_TYPE_MOVIE,
  FAVOURITE_TYPE_PERSON,
  MOVIE_ITEM_KIND_EPISODE,
  MOVIE_ITEM_KIND_SEASON,
  MOVIE_ITEM_KIND_TRAILER,
  MOVIE_LIST_TAB_ALL,
  MOVIE_LIST_TAB_TIME,
  MOVIE_TAB_ACTOR,
  MOVIE_TAB_DIRECTOR,
  MOVIE_TAB_EPISODE,
  MOVIE_TAB_SUGGESTION,
  MOVIE_TAB_TRAILER,
  MOVIE_TYPE_SERIES,
  MOVIE_TYPE_SINGLE,
  PERSON_KIND_ACTOR,
  PERSON_KIND_DIRECTOR,
  REVIEW_RATING_BAD,
  REVIEW_RATING_BORING,
  REVIEW_RATING_GOOD,
  REVIEW_RATING_OK,
  REVIEW_RATING_WONDERFUL,
  VIDEO_QUALITY_1080,
  VIDEO_QUALITY_1440,
  VIDEO_QUALITY_720,
  VIDEO_QUALITY_AUTO,
  VIDEO_QUALITY_MAX
} from '@/constants/constant';
import type { OptionType } from '@/types';
import type { StaticImageData } from 'next/image';

export const movieItemKinds = {
  MOVIE_ITEM_KIND_TRAILER,
  MOVIE_ITEM_KIND_EPISODE,
  MOVIE_ITEM_KIND_SEASON
};

export const movieTypes = {
  MOVIE_TYPE_SINGLE,
  MOVIE_TYPE_SERIES
};

export const reviewRatings: (Pick<OptionType, 'value' | 'label'> & {
  icon: StaticImageData;
})[] = [
  { value: REVIEW_RATING_BAD, label: 'Dở tệ', icon: ratingBad },
  { value: REVIEW_RATING_BORING, label: 'Phim chán', icon: ratingBoring },
  { value: REVIEW_RATING_OK, label: 'Phim ổn', icon: ratingOk },
  { value: REVIEW_RATING_GOOD, label: 'Phim hay', icon: ratingGood },
  { value: REVIEW_RATING_WONDERFUL, label: 'Tuyệt vời', icon: ratingWonderful }
];

export const discussionTabs: { key: string; label: string }[] = [
  { key: DISCUSSION_TAB_COMMENT, label: 'Bình luận' },
  { key: DISCUSSION_TAB_REVIEW, label: 'Đánh giá' }
];

export const movieListTabs: { key: string; label: string }[] = [
  { key: MOVIE_LIST_TAB_ALL, label: 'Tất cả' },
  { key: MOVIE_LIST_TAB_TIME, label: 'Thời gian' }
];

export const movieTabPersonTitles: Record<number, string> = {
  [PERSON_KIND_ACTOR]: 'Diễn viên',
  [PERSON_KIND_DIRECTOR]: 'Đạo diễn'
};

export const movieTabs: OptionType[] = [
  {
    value: MOVIE_TAB_EPISODE,
    label: 'Tập phim'
  },
  {
    value: MOVIE_TAB_TRAILER,
    label: 'Trailer'
  },
  {
    value: MOVIE_TAB_ACTOR,
    label: 'Diễn viên'
  },
  {
    value: MOVIE_TAB_DIRECTOR,
    label: 'Đạo diễn'
  },
  {
    value: MOVIE_TAB_SUGGESTION,
    label: 'Đề xuất'
  }
];

export const favouriteTabs = [
  {
    value: FAVOURITE_TYPE_MOVIE,
    label: 'Phim'
  },
  {
    value: FAVOURITE_TYPE_PERSON,
    label: 'Diễn viên'
  }
];

export const qualityOptions = [
  { value: VIDEO_QUALITY_AUTO, label: 'Tự động' },
  { value: VIDEO_QUALITY_720, label: '720p' },
  { value: VIDEO_QUALITY_1080, label: '1080p' },
  { value: VIDEO_QUALITY_1440, label: '1440p' },
  { value: VIDEO_QUALITY_MAX, label: 'Tối đa' }
];
