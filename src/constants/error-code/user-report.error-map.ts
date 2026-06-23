import { ErrorCode } from './error-code';
import { ErrorMaps, UserReportBodyType } from '@/types';

export const userReportCommentErrorMaps: ErrorMaps<UserReportBodyType> = {
  [ErrorCode.USER_REPORT_ERROR_EXISTED]: [
    [
      'objectId',
      { type: 'manual', message: 'Bạn đã báo cáo bình luận này rồi' }
    ]
  ]
};

export const userReportReviewErrorMaps: ErrorMaps<UserReportBodyType> = {
  [ErrorCode.USER_REPORT_ERROR_EXISTED]: [
    ['objectId', { type: 'manual', message: 'Bạn đã báo cáo đánh giá này rồi' }]
  ]
};
