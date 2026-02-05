'use client';

import { logo } from '@/assets';
import { Button, Col, InputField, PasswordField, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import envConfig from '@/config';
import { setData } from '@/utils';
import Image from 'next/image';
import z from 'zod';

const introSchema = z.object({
  key: z.string().nonempty('Bắt buộc')
});

export default function IntroForm() {
  const defaultValues: z.infer<typeof introSchema> = {
    key: ''
  };

  const onSubmit = (data: z.infer<typeof introSchema>) => {
    if (data.key === envConfig.NEXT_PUBLIC_ACCESS_KEY) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 3);

      setData('intro_access_granted', 'true');
      setData('intro_access_expiry', expiryDate.toISOString());
      window.location.href = '/';
    }
  };

  // const onSubmit = (data: z.infer<typeof introSchema>) => {
  //   if (data.key === envConfig.NEXT_PUBLIC_ACCESS_KEY) {
  //     const expiryDate = new Date();
  //     expiryDate.setSeconds(expiryDate.getSeconds() + 5);

  //     setData('intro_access_granted', 'true');
  //     setData('intro_access_expiry', expiryDate.toISOString());
  //     window.location.href = '/';
  //   }
  // };

  return (
    <BaseForm
      schema={introSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      className='mx-auto flex h-screen w-200 flex-col items-center justify-center'
    >
      {(form) => (
        <>
          <Row>
            <Image src={logo} alt='Logo' width={100} height={100} unoptimized />
          </Row>
          <Row className='w-full justify-center'>
            <Col span={12}>
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
            <Col span={12}>
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
