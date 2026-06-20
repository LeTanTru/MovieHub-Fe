'use client';

import {
  Button,
  Col,
  RadioGroupField,
  Row,
  TextAreaField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { Modal } from '@/components/modal';
import {
  reportReasons,
  USER_REPORT_REASON_OTHER,
  USER_REPORT_TYPE_REVIEW
} from '@/constants';
import { logger } from '@/logger';
import { useCreateUserReportMutation } from '@/queries';
import { userReportSchema } from '@/schemaValidations';
import { UserReportBodyType } from '@/types';
import { notify } from '@/utils';
import { useMemo, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

type ReviewReportModalProps = {
  open: boolean;
  reviewId: string;
  onClose: () => void;
};

export default function ReviewReportModal({
  open,
  reviewId,
  onClose
}: ReviewReportModalProps) {
  const [selectedReason, setSelectedReason] = useState('');

  const { mutate, isPending } = useCreateUserReportMutation();

  const defaultValues: UserReportBodyType = useMemo(() => {
    return { content: '', objectId: reviewId, type: USER_REPORT_TYPE_REVIEW };
  }, [reviewId]);

  const handleReasonChange = (
    value: string,
    form: UseFormReturn<UserReportBodyType>
  ) => {
    setSelectedReason(value);

    if (value === USER_REPORT_REASON_OTHER) {
      form.setValue('content', '', {
        shouldDirty: true,
        shouldValidate: true
      });
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    onClose();
  };

  const onSubmit = (values: UserReportBodyType) => {
    const content = values?.content?.trim() || '';

    if (!content) {
      notify.error('Vui lòng chọn hoặc nhập lý do báo cáo');
      return;
    }

    mutate(
      {
        ...values,
        content
      },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success('Báo cáo đánh giá thành công');
            handleClose();
          } else {
            notify.error('Báo cáo đánh giá thất bại');
          }
        },
        onError: (error) => {
          logger.error('USER_REPORT_REVIEW_ERROR', error);
          notify.error('Báo cáo đánh giá thất bại');
        }
      }
    );
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className='max-520:w-[95vw] top-1/2 w-100 -translate-y-1/2'
    >
      <Modal.Header className='border-b'>Báo cáo đánh giá</Modal.Header>
      <Modal.Body scrollable className='max-h-[min(32.5rem,75vh)]'>
        <BaseForm
          onSubmit={onSubmit}
          schema={userReportSchema}
          defaultValues={defaultValues}
          initialValues={defaultValues}
          className='bg-transparent'
        >
          {(form) => (
            <>
              <Row className='mb-4'>
                <Col className='grid-c-12'>
                  <RadioGroupField
                    label='Chọn lý do'
                    control={form.control}
                    name='content'
                    value={selectedReason}
                    options={reportReasons}
                    onValueChange={(value) => handleReasonChange(value, form)}
                  />
                </Col>
              </Row>
              {selectedReason === USER_REPORT_REASON_OTHER && (
                <Row>
                  <Col className='grid-c-12'>
                    <TextAreaField
                      control={form.control}
                      name='content'
                      rows={4}
                      maxLength={1000}
                      label='Lý do khác'
                      placeholder='Nhập lý do báo cáo...'
                      className='scrollbar-none min-h-25 resize-none bg-transparent'
                    />
                  </Col>
                </Row>
              )}
              <Row className='bg-charade sticky bottom-0 z-10 -mx-4 mt-4 -mb-4 flex items-center justify-center border-t px-4 py-4'>
                <Col className='grid-c-6'>
                  <Button
                    type='button'
                    className='max-640:text-[13px]'
                    onClick={handleClose}
                  >
                    Đóng
                  </Button>
                </Col>
                <Col className='grid-c-6'>
                  <Button
                    className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80 max-640:text-[13px]'
                    variant='primary'
                    loading={isPending}
                    disabled={
                      !selectedReason ||
                      !form.formState.isDirty ||
                      isPending ||
                      (selectedReason === USER_REPORT_REASON_OTHER &&
                        !String(form.watch('content') || '').trim())
                    }
                  >
                    Gửi báo cáo
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </BaseForm>
      </Modal.Body>
    </Modal>
  );
}
