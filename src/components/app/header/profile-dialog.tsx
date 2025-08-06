import {
  AutoCompleteField,
  Button,
  Col,
  InputField,
  Row,
  ToolTip,
  UploadImageField
} from '@/components/form';
import BaseForm from '@/components/form/base-form';
import { GENDER, genderOptions } from '@/constants';
import { cn } from '@/lib';
import { logger } from '@/logger';
import { useProfileMutation, useUploadImageMutation } from '@/queries';
import { updateProfileSchema } from '@/schemaValidations';
import { useAuthStore, useProfileDialogStore } from '@/store';
import { ProfileResType, UpdateProfileType } from '@/types';
import { notify } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProfileDialog() {
  const { open, setOpen } = useProfileDialogStore();
  const { profile } = useAuthStore();
  const [avatarPath, setAvatarPath] = useState(profile?.avatarPath);
  const [isFormChanged, setIsFormChanged] = useState(false);
  console.log('🚀 ~ ProfileDialog ~ isFormChanged:', isFormChanged);
  const uploadImageMutation = useUploadImageMutation();
  const profileMutation = useProfileMutation();

  const defaultValues: ProfileResType = {
    id: profile?.id || 0,
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    username: profile?.username || '',
    gender: GENDER.includes(profile?.gender!)
      ? profile?.gender!
      : genderOptions[0].value,
    avatarPath
  };

  useEffect(() => {
    if (profile) {
      setAvatarPath(profile.avatarPath);
    }
  }, [profile]);

  const onSubmit = async (values: UpdateProfileType) => {
    try {
      const response = await profileMutation.mutateAsync({
        ...values,
        avatarPath
      });
      if (response.result) {
        notify.success('Cập nhật thành công');
      }
    } catch (error) {
      logger.error('Error while updating profile: ', error);
      notify.error('Cập nhật thất bại');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setOpen(false)}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
        >
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='bg-background relative w-full max-w-2xl rounded-lg p-6 shadow-[0px_0px_10px_0px_var(--accent)]'
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
              e.stopPropagation()
            }
          >
            <ToolTip content='Đóng' side='bottom'>
              <Button
                variant='ghost'
                className='absolute top-4 right-4 rounded-full p-1 hover:bg-transparent! hover:text-gray-500'
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </ToolTip>
            <BaseForm
              schema={updateProfileSchema}
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              onChange={() => setIsFormChanged(true)}
            >
              {(form) => (
                <>
                  <UploadImageField
                    label='Ảnh đại diện'
                    value={avatarPath}
                    onChange={(url) => {
                      setAvatarPath(url);
                      setIsFormChanged(true);
                    }}
                    uploadImageFn={async (blob) => {
                      const response =
                        await uploadImageMutation.mutateAsync(blob);
                      return response.data?.filePath!;
                    }}
                  />
                  <Row>
                    <Col>
                      <InputField
                        control={form.control}
                        name='fullName'
                        label='Họ và tên'
                        required
                        placeholder='Nhập họ và tên'
                      />
                    </Col>
                    <Col>
                      <InputField
                        control={form.control}
                        name='email'
                        label='Email'
                        required
                        placeholder='Nhập email'
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <InputField
                        control={form.control}
                        name='username'
                        label='Tên đăng nhập'
                        required
                        placeholder='Nhập tên đăng nhập'
                      />
                    </Col>
                    <Col>
                      <AutoCompleteField
                        control={form.control}
                        options={genderOptions}
                        name='gender'
                        label='Giới tính'
                        required
                        getLabel={(opt) => opt.label}
                        getValue={(opt) => opt.value}
                        placeholder='Chọn giới tính'
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <InputField
                        control={form.control}
                        name='phone'
                        label='Số điện thoại'
                        required
                        placeholder='Nhập số điện thoại'
                      />
                    </Col>
                  </Row>
                  <div className='mt-6 flex justify-end gap-2'>
                    <Button
                      type='button'
                      variant={'destructive'}
                      onClick={() => setOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      type='submit'
                      className={cn('ml-2 w-32', {
                        'cursor-not-allowed opacity-50': !isFormChanged
                      })}
                    >
                      {profileMutation?.isPending ? (
                        <Loader2
                          className='size-6 animate-spin'
                          strokeWidth={3}
                        />
                      ) : (
                        'Cập nhật'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </BaseForm>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
