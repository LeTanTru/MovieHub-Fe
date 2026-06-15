'use client';

import { logo } from '@/assets';
import { Button, Col, PasswordField, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { apiConfig } from '@/constants';
import { setData } from '@/utils';
import Image from 'next/image';
import { UseFormReturn } from 'react-hook-form';
import z from 'zod';

const introSchema = z.object({
  key: z.string().nonempty('Bắt buộc')
});

const defaultValues: z.infer<typeof introSchema> = {
  key: ''
};

export function IntroForm() {
  const onSubmit = async (
    data: z.infer<typeof introSchema>,
    form: UseFormReturn<z.infer<typeof introSchema>>
  ) => {
    try {
      const res = await fetch(apiConfig.api.auth.validateIntro.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: data.key })
      });

      if (res.ok) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 3);

        setData('intro_access_granted', 'true');
        setData('intro_access_expiry', expiryDate.toISOString());
        window.location.href = '/';
      } else {
        const result = await res.json();
        form.setError('key', { message: result.message || 'Key không hợp lệ' });
      }
    } catch {
      form.setError('key', { message: 'Key không hợp lệ' });
    }
  };

  return (
    <BaseForm
      schema={introSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      className='mx-auto flex h-screen max-w-200 flex-col items-center justify-center bg-transparent'
    >
      {(form) => (
        <>
          <Row>
            <Col className='grid-c-12 grid-col-no-gutters'>
              <Image
                src={logo}
                alt='Logo'
                width={100}
                height={100}
                unoptimized
                className='max-600:size-20 mx-auto'
              />
            </Col>
          </Row>
          <Row className='w-full justify-center'>
            <Col className='max-800:grid-c-8 max-600:grid-c-10 max-520:grid-c-12 grid-c-6'>
              <PasswordField
                control={form.control}
                name='key'
                label='Nhập key để truy cập'
                required
                placeholder='Nhập key để truy cập'
              />
            </Col>
          </Row>
          <Row className='w-full justify-center'>
            <Col className='max-800:grid-c-8 max-600:grid-c-10 max-520:grid-c-12 grid-c-6'>
              <Button disabled={!form.formState.isDirty} type='submit'>
                Truy cập
              </Button>
            </Col>
          </Row>
        </>
      )}
    </BaseForm>
  );
}
