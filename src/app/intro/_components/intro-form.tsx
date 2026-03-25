'use client';

import { logo } from '@/assets';
import { Button, Col, PasswordField, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import envConfig from '@/config';
import { setData } from '@/utils';
import Image from 'next/image';
import { UseFormReturn } from 'react-hook-form';
import z from 'zod';

const introSchema = z.object({
  key: z.string().nonempty('Bắt buộc')
});

export default function IntroForm() {
  const defaultValues: z.infer<typeof introSchema> = {
    key: ''
  };

  const onSubmit = (
    data: z.infer<typeof introSchema>,
    form: UseFormReturn<z.infer<typeof introSchema>>
  ) => {
    if (data.key === envConfig.NEXT_PUBLIC_ACCESS_KEY) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 3);
      // expiryDate.setSeconds(expiryDate.getSeconds() + 5);

      setData('intro_access_granted', 'true');
      setData('intro_access_expiry', expiryDate.toISOString());
      window.location.href = '/';
    } else {
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
            <Col className='w-full'>
              <Image
                src={logo}
                alt='Logo'
                width={100}
                height={100}
                unoptimized
                className='max-600:size-20'
              />
            </Col>
          </Row>
          <Row className='w-full justify-center'>
            <Col
              span={24}
              className='max-800:w-2/3 max-600:w-4/5 max-520:w-full w-1/2'
            >
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
            <Col className='max-800:w-2/3 max-600:w-4/5 max-520:w-full w-1/2'>
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
