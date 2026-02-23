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
import { applyFormErrors, notify, removeDatas } from '@/utils';
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
        removeDatas([
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
    <section className='bg-vintage-blue rounded-lg px-6 py-4'>
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
              <Row className='mb-0 justify-center'>
                <Col span={24} className='mb-8'>
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
                <Col span={24} className='mb-8'>
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
                <Col span={24} className='mb-8'>
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
              <Row className='mb-2 justify-end'>
                <Col span={12}>
                  <Button
                    type='button'
                    variant='outline'
                    disabled={!form.formState.isDirty}
                  >
                    Hủy
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type='submit'
                    variant='primary'
                    className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80'
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
