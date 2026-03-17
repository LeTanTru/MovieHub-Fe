'use client';

import { Button, Col, PasswordField, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { changePasswordErrorMaps, storageKeys } from '@/constants';
import { logger } from '@/logger';
import {
  useChangePasswordMutation,
  useLogoutMutation,
  useRemoveCookieServerMutation
} from '@/queries';
import { route } from '@/routes';
import { changePasswordSchema } from '@/schemaValidations';
import { ChangePasswordBodyType } from '@/types';
import { applyFormErrors, notify, removeData } from '@/utils';
import { UseFormReturn } from 'react-hook-form';

export default function ChangePasswordForm() {
  const { mutateAsync: logoutMutate, isPending: logoutLoading } =
    useLogoutMutation();

  const { mutateAsync: removeCookieMutate, isPending: removeCookieLoading } =
    useRemoveCookieServerMutation();

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
      const payload: Omit<ChangePasswordBodyType, 'confirmNewPassword'> = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      };

      const res = await changePasswordMutate(payload);
      if (res.result) {
        form.reset();
        await logoutMutate();
        await removeCookieMutate();
        removeData([
          storageKeys.ACCESS_TOKEN,
          storageKeys.REFRESH_TOKEN,
          storageKeys.USER_KIND
        ]);
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
      logger.error('Error while changing password: ', error);
      notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
    }
  };

  return (
    <section className='bg-vintage-blue max-520:px-4 rounded-lg px-6 py-4'>
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
                <Col className='w-full'>
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
                <Col className='w-full'>
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
                <Col className='w-full'>
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
              <Row className='max-640:mb-0 max-600:flex-col-reverse max-600:gap-6 mb-2 flex justify-end'>
                <Col className='max-600:w-full my-0 w-1/2'>
                  <Button
                    type='button'
                    variant='outline'
                    className='w-full'
                    disabled={!form.formState.isDirty}
                  >
                    Hủy
                  </Button>
                </Col>
                <Col className='max-600:w-full my-0 w-1/2'>
                  <Button
                    type='submit'
                    variant='primary'
                    className='dark:bg-golden-glow dark:hover:bg-golden-glow/80 dark:disabled:bg-golden-glow/80 dark:disabled:hover:bg-golden-glow/80 w-full'
                    loading={
                      changePasswordLoading ||
                      logoutLoading ||
                      removeCookieLoading
                    }
                    disabled={
                      !form.formState.isDirty ||
                      changePasswordLoading ||
                      logoutLoading ||
                      removeCookieLoading
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
