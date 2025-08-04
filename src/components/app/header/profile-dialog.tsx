import {
  AutoCompleteField,
  Button,
  InputField,
  UploadAvatarField,
  ToolTip
} from '@/components/form';
import { Form } from '@/components/ui/form';
import { useProfileDialogStore } from '@/store';
import { UpdateProfileType } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function ProfileDialog() {
  const { open, setOpen } = useProfileDialogStore();
  const form = useForm<UpdateProfileType>({
    defaultValues: {
      avatarPath: '',
      email: '',
      fullName: '',
      username: '',
      phone: '',
      gender: 0
    }
  });
  const onSubmit = async (values: UpdateProfileType) => {};

  const genderOptions = [
    { id: 0, name: 'Nam' },
    { id: 1, name: 'Nữ' },
    { id: 2, name: 'Khác' }
  ];

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
            className='bg-background relative w-full max-w-2xl rounded-lg p-6 shadow-lg'
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <UploadAvatarField
                  control={form.control}
                  name='avatarPath'
                  label='Ảnh đại diện'
                />
                <div className='mt-4 grid grid-cols-2 gap-4'>
                  <InputField
                    control={form.control}
                    name='fullName'
                    label='Họ và tên'
                    required
                    placeholder='Nhập họ và tên'
                  />
                  <InputField
                    control={form.control}
                    name='email'
                    label='Email'
                    required
                    placeholder='Nhập email'
                  />
                  <InputField
                    control={form.control}
                    name='username'
                    label='Tên đăng nhập'
                    required
                    placeholder='Nhập tên đăng nhập'
                  />
                  <AutoCompleteField
                    control={form.control}
                    options={genderOptions}
                    name='gender'
                    label='Giới tính'
                    required
                    getLabel={(opt) => opt.name}
                    getValue={(opt) => opt.id}
                    placeholder='Chọn giới tính'
                  />
                  <InputField
                    control={form.control}
                    name='phone'
                    label='Số điện thoại'
                    required
                    placeholder='Nhập số điện thoại'
                  />
                </div>
                <div className='mt-6 flex justify-end gap-2'>
                  <Button variant={'destructive'}>Hủy</Button>
                  <Button type='submit' className='ml-2'>
                    Cập nhật
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
