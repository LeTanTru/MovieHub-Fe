'use client';

import type { UseFormReturn } from 'react-hook-form';
import { Button, Col, InputField, Row } from '@/components/form';
import type { ForgotPasswordBodyType } from '@/types';

type StepOneFormSectionProps = {
  form: UseFormReturn<ForgotPasswordBodyType>;
  loading: boolean;
  isFormChanged: boolean;
};

export function StepOneFormSection({
  form,
  loading,
  isFormChanged
}: StepOneFormSectionProps) {
  return (
    <>
      <Row>
        <Col className='grid-c-12'>
          <InputField
            control={form.control}
            name='email'
            label='Email'
            placeholder='Nhập email của bạn'
            required
          />
        </Col>
      </Row>
      <Row className='mb-0'>
        <Col className='grid-c-12'>
          <Button
            type='submit'
            variant='primary'
            className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80 w-full'
            disabled={loading || !isFormChanged}
            loading={loading}
          >
            Gửi yêu cầu
          </Button>
        </Col>
      </Row>
    </>
  );
}
