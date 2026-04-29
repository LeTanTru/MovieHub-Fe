'use client';

import { Button, Col, PasswordField, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { changePasswordErrorMaps, storageKeys } from '@/constants';
import { logger } from '@/logger';
import { useChangePasswordMutation, useLogoutMutation } from '@/queries';
import { route } from '@/routes';
import { changePasswordSchema } from '@/schemaValidations';
import { ChangePasswordBodyType } from '@/types';
import { applyFormErrors, notify, removeData } from '@/utils';
import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { ConfirmModal } from '@/components/modal';

export default function ChangePasswordForm() {
  const { mutateAsync: logoutMutate, isPending: logoutLoading } =
    useLogoutMutation();

  const {
    mutateAsync: changePasswordMutate,
    isPending: changePasswordLoading
  } = useChangePasswordMutation();

  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

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
      const payload: Omit<ChangePasswordBodyType, 'confirmNewPassword'> = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      };

      const res = await changePasswordMutate(payload);
      if (res.result) {
        form.reset();
        await logoutMutate();
        removeData([storageKeys.ACCESS_TOKEN, storageKeys.REFRESH_TOKEN]);
        notify.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại');
        setTimeout(() => {
          window.location.href = route.login.path;
        }, 500);
      } else {
        const errorCode = res.code;
        if (errorCode) {
          applyFormErrors(form, errorCode, changePasswordErrorMaps);
        } else {
          notify.error('Đổi mật khẩu thất bại');
        }
      }
    } catch (error) {
      logger.error('[CHANGE_PASSWORD_ERROR]', error);
      notify.error('Đổi mật khẩu thất bại');
    }
  };

  return (
    <section className='bg-vintage-blue max-520:px-4 rounded-lg p-4'>
      <h3 className='text-center text-xl font-medium'>Đổi mật khẩu</h3>
      <p className='mt-2 text-center text-sm text-slate-400'>
        Cập nhật mật khẩu tài khoản <br /> để đảm bảo an toàn cho tài khoản của
        bạn
      </p>
      <BaseForm
        schema={changePasswordSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        className='mt-4 bg-transparent p-0'
      >
        {(form) => {
          return (
            <>
              <Row>
                <Col className='grid-c-12'>
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
              <Row>
                <Col className='grid-c-12'>
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
              <Row>
                <Col className='grid-c-12'>
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
              <Row className='max-640:mb-0 max-480:flex-col-reverse max-480:gap-6 mb-2 flex justify-end'>
                <Col className='grid-c-6 max-480:grid-c-12'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setShowConfirmCancel(true)}
                    disabled={
                      !form.formState.isDirty ||
                      changePasswordLoading ||
                      logoutLoading
                    }
                    className='border-gray-200 text-white hover:border-gray-200/80 hover:text-white/80 disabled:border-gray-200/80 disabled:text-white/80 disabled:hover:border-gray-200/80 disabled:hover:text-white/80'
                  >
                    Hủy
                  </Button>
                  <ConfirmModal
                    open={showConfirmCancel}
                    onOpenChange={setShowConfirmCancel}
                    message='Bạn có chắc chắn muốn hủy không?'
                    onConfirm={() => form.reset()}
                  />
                </Col>
                <Col className='grid-c-6 max-480:grid-c-12'>
                  <Button
                    type='submit'
                    variant='primary'
                    className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80 w-full'
                    loading={changePasswordLoading || logoutLoading}
                    disabled={
                      !form.formState.isDirty ||
                      changePasswordLoading ||
                      logoutLoading
                    }
                  >
                    Đổi mật khẩu
                  </Button>
                </Col>
              </Row>
            </>
          );
        }}
      </BaseForm>
    </section>
  );
}
