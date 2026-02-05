'use client';

import { Button, Col, PasswordField, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { changePasswordErrorMaps } from '@/constants';
import { logger } from '@/logger';
import { useChangePasswordMutation } from '@/queries';
import { changePasswordSchema } from '@/schemaValidations';
import { ChangePasswordBodyType } from '@/types';
import { applyFormErrors, notify } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { UseFormReturn } from 'react-hook-form';

export default function ChangePasswordForm() {
  const {
    mutateAsync: changePasswordMutate,
    isPending: changePasswordLoading
  } = useChangePasswordMutation();

  const defaultValues: ChangePasswordBodyType = {
    confirmNewPassword: '',
    newPassword: '',
    oldPassword: ''
  };

  const onSubmit = async (
    values: ChangePasswordBodyType,
    form: UseFormReturn<ChangePasswordBodyType>
  ) => {
    try {
      const res = await changePasswordMutate({
        ...values
      });
      if (res.result) {
        notify.success('Đổi mật khẩu thành công');
        form.reset();
      } else {
        const errorCode = res.code;
        if (errorCode) {
          applyFormErrors(form, errorCode, changePasswordErrorMaps);
        } else {
          notify.error('Có lỗi xảy ra');
        }
      }
    } catch (error) {
      logger.error('Error while changing password: ', error);
      notify.error('Đổi mật khẩu thất bại');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className='bg-main-background max-1120:mx-auto max-1120:mt-8 max-1120:w-140 max-1368:w-5/6 max-600:w-full relative mx-auto rounded-lg'
      >
        <h3 className='text-center text-xl font-medium'>Đổi mật khẩu</h3>
        <p className='mt-2 text-center text-sm text-slate-400'>
          Cập nhật mật khẩu tài khoản để đảm bảo an toàn cho tài khoản của bạn
        </p>
        <BaseForm
          schema={changePasswordSchema}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          className='mx-auto mt-4 p-0'
        >
          {(form) => {
            return (
              <>
                <Row className='mb-0 justify-center'>
                  <Col span={12} className='mb-8'>
                    <PasswordField
                      control={form.control}
                      name='oldPassword'
                      label='Mật khẩu cũ'
                      required
                      placeholder='Nhập mật khẩu cũ'
                      className='text-sm'
                    />
                  </Col>
                </Row>
                <Row className='mb-0 justify-center'>
                  <Col span={12} className='mb-8'>
                    <PasswordField
                      control={form.control}
                      name='newPassword'
                      label='Mật khẩu mới'
                      required
                      placeholder='Nhập mật khẩu mới'
                      className='text-sm'
                    />
                  </Col>
                </Row>
                <Row className='mb-0 justify-center'>
                  <Col span={12} className='mb-8'>
                    <PasswordField
                      control={form.control}
                      name='confirmNewPassword'
                      label='Nhập lại mật khẩu mới'
                      required
                      placeholder='Nhập lại mật khẩu mới'
                      className='text-sm'
                    />
                  </Col>
                </Row>
                <Row className='mb-0 justify-center'>
                  <Col span={12} className=''>
                    <Row className='max-1120:mt-4 mb-0 flex justify-end'>
                      <Col span={6} className=''>
                        <Button
                          type='button'
                          className={'w-full'}
                          variant={'outline'}
                          disabled={!form.formState.isDirty}
                        >
                          Hủy
                        </Button>
                      </Col>
                      <Col span={6} className=''>
                        <Button
                          type='submit'
                          variant='primary'
                          className={'w-full'}
                          loading={changePasswordLoading}
                          disabled={!form.formState.isDirty}
                        >
                          Đổi mật khẩu
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            );
          }}
        </BaseForm>
      </motion.div>
    </AnimatePresence>
  );
}
