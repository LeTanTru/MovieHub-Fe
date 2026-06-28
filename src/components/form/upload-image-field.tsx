'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { CircleUserRoundIcon, UploadIcon, XIcon } from 'lucide-react';

import { AvatarField } from './avatar-field';
import { Button } from './button';
import { ImageField } from './image-field';
import { ConfirmModal } from '@/components/modal/confirm-modal';
import { FormLabel } from '@/components/ui/form';
import { cn } from '@/lib';
import { useFileUpload } from '@/hooks';
import { logger } from '@/logger';
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController
} from 'react-hook-form';
import { CircleLoading } from '@/components/loading';
import type { ApiResponseNoData } from '@/types';
import { ImageCropperDialog } from './image-cropper-dialog';

const DEFAULT_FIELD_SIZE = 70;
const REMOVE_BUTTON_OFFSET_PERCENT = 4;
const REMOVE_BUTTON_OFFSET_PX = -4;

type UploadImageFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: ReactNode;
  value?: string;
  required?: boolean;
  labelClassName?: string;
  className?: string;
  imageClassName?: string;
  size?: number;
  loading?: boolean;
  aspect?: number;
  defaultCrop?: boolean;
  originalSize?: boolean;
  allowCustomAspect?: boolean;
  avatar?: boolean;
  onChange?: (url: string) => void;
  uploadImageFn: (file: Blob) => Promise<string>;
  deleteImageFn?: (url: string) => Promise<ApiResponseNoData | undefined>;
};

export function UploadImageField<T extends FieldValues>({
  control,
  name,
  label,
  value,
  required,
  labelClassName,
  className,
  imageClassName,
  size = DEFAULT_FIELD_SIZE,
  loading,
  aspect = 1,
  defaultCrop = false,
  originalSize = false,
  allowCustomAspect = false,
  avatar = false,
  onChange,
  uploadImageFn,
  deleteImageFn
}: UploadImageFieldProps<T>) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [keepOriginalSize, setKeepOriginalSize] =
    useState<boolean>(originalSize);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  const {
    field: { value: fieldValue, onChange: fieldOnChange },
    fieldState: { error }
  } = useController({ name, control });

  const [
    { files, isDragging },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
      clearFiles
    }
  ] = useFileUpload({ accept: 'image/*' });

  const previewUrl = files[0]?.preview;
  const fileId = files[0]?.id;
  const previousFileIdRef = useRef<string | null>(null);

  const handleCroppedConfirm = async (blob: Blob, keepOriginal: boolean) => {
    if (!uploadImageFn) return;
    try {
      const uploadedUrl = await uploadImageFn(blob);
      onChange?.(uploadedUrl);
      fieldOnChange(uploadedUrl);
      setKeepOriginalSize(keepOriginal);
      setDialogOpen(false);
    } catch (error) {
      logger.error('[UPLOAD_IMAGE_ERROR]', error);
    }
  };

  const handleRemove = async () => {
    try {
      if (deleteImageFn && fieldValue) {
        await deleteImageFn(fieldValue);
      }
    } catch (err) {
      logger.error('[DELETE_IMAGE_ERROR]', err);
    }
    onChange?.('');
    fieldOnChange('');
    clearFiles();
    setConfirmRemoveOpen(false);
  };

  useEffect(() => {
    if (fileId && fileId !== previousFileIdRef.current) {
      setDialogOpen(true);
    }
    previousFileIdRef.current = fileId;
  }, [fileId]);

  return (
    <>
      <div className={cn('relative', className)}>
        <div className='flex flex-col items-center justify-center gap-2'>
          {label && (
            <FormLabel
              className={cn(
                {
                  'text-rose-500': error?.message
                },
                labelClassName
              )}
            >
              {label}
              {required && <span className='text-rose-500'>*</span>}
            </FormLabel>
          )}
          <div
            role='button'
            className={cn(
              'group relative inline-flex cursor-pointer items-center justify-center rounded',
              {
                'border-input hover:bg-gunmetal-blue border-2 border-dashed transition-all transition-colors duration-200 ease-linear':
                  !value,
                'rounded-full': avatar,
                'border-gray-300 bg-gray-100': isDragging,
                'border-rose-500': !!error
              }
            )}
            style={{
              width: size * aspect,
              height: size
            }}
            onClick={openFileDialog}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            title='Tải ảnh lên'
            data-dragging={isDragging || undefined}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openFileDialog();
              }
            }}
          >
            {!!value ? (
              <div className='relative size-full'>
                {avatar ? (
                  <AvatarField
                    src={value}
                    size={size}
                    disablePreview
                    className='size-full'
                  />
                ) : (
                  <ImageField
                    disablePreview
                    src={value}
                    className={cn('size-full rounded', {
                      'bg-black': keepOriginalSize
                    })}
                    aspect={aspect}
                    width={size * aspect}
                    height={size}
                    imageClassName={cn(
                      keepOriginalSize ? 'object-contain!' : 'object-cover!',
                      imageClassName
                    )}
                  />
                )}
                {value && (
                  <ConfirmModal
                    message='Bạn có chắc chắn muốn xóa ảnh này không?'
                    onConfirm={handleRemove}
                    open={confirmRemoveOpen}
                    onOpenChange={setConfirmRemoveOpen}
                    trigger={
                      <Button
                        size='icon'
                        type='button'
                        title='Xóa ảnh'
                        className={cn(
                          'border-background bg-accent hover:bg-accent/80 absolute size-6 rounded-full border-none text-white hover:text-rose-500'
                        )}
                        style={{
                          top: avatar
                            ? (REMOVE_BUTTON_OFFSET_PERCENT * size) / 100
                            : REMOVE_BUTTON_OFFSET_PX,
                          right: avatar
                            ? (REMOVE_BUTTON_OFFSET_PERCENT * size) / 100
                            : REMOVE_BUTTON_OFFSET_PX
                        }}
                        aria-label='Remove image'
                      >
                        <XIcon className='size-5' />
                      </Button>
                    }
                  />
                )}
              </div>
            ) : loading ? (
              <CircleLoading className='stroke-light-gray' />
            ) : avatar ? (
              <CircleUserRoundIcon
                strokeWidth={1}
                className='size-full max-h-1/3 max-w-1/3 stroke-gray-300 transition-all duration-200 ease-linear group-hover:stroke-gray-400'
              />
            ) : (
              <UploadIcon
                strokeWidth={1}
                className='size-full max-h-1/3 max-w-1/3 stroke-gray-300 transition-all duration-200 ease-linear group-hover:stroke-gray-400'
              />
            )}

            <label htmlFor='input' className='cursor-pointer'>
              <span className='sr-only'>Upload file</span>
              <input
                id='input'
                {...getInputProps()}
                className='sr-only'
                tabIndex={-1}
              />
            </label>
          </div>
        </div>
        {error?.message && (
          <div className='animate-in fade-in -mb-6 flex min-h-6 items-end justify-center'>
            <p className='text-sm leading-5.5 text-rose-500'>{error.message}</p>
          </div>
        )}
      </div>

      <ImageCropperDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        previewUrl={previewUrl ?? null}
        file={files[0]?.file instanceof File ? files[0].file : null}
        aspect={aspect}
        defaultCrop={defaultCrop}
        originalSize={originalSize}
        allowCustomAspect={allowCustomAspect}
        onConfirm={handleCroppedConfirm}
      />
    </>
  );
}
