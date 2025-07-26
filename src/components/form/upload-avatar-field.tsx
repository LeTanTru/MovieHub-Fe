'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useController } from 'react-hook-form';
import {
  ArrowLeftIcon,
  CircleUserRoundIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon
} from 'lucide-react';

import {
  Cropper,
  CropperCropArea,
  CropperDescription,
  CropperImage
} from '@/components/ui/cropper';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/form';
import { FormLabel } from '@/components/ui/form';
import { cn } from '@/lib';
import { useFileUpload, useTranslate } from '@/hooks';
import { logger } from '@/logger';

type Area = { x: number; y: number; width: number; height: number };

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob | null> {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
    });
  } catch (error) {
    logger.error('getCroppedImg error:', error);
    return null;
  }
}

interface UploadAvatarFieldProps {
  name: string;
  control: any;
  label?: string;
  required?: boolean;
  labelClassName?: string;
}

export default function UploadAvatarField({
  name,
  control,
  label,
  required,
  labelClassName
}: UploadAvatarFieldProps) {
  const { field } = useController({ name, control });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [zoom, setZoom] = useState(1);
  const translate = useTranslate();

  const [
    { files, isDragging },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps
    }
  ] = useFileUpload({ accept: 'image/*' });

  const previewUrl = files[0]?.preview || null;
  const fileId = files[0]?.id;
  const previousFileIdRef = useRef<string | null>(null);

  const handleCropChange = useCallback((pixels: Area | null) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = async () => {
    if (!previewUrl || !fileId || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);
    if (!croppedBlob) return;

    const objectUrl = URL.createObjectURL(croppedBlob);

    field.onChange({ blob: croppedBlob, preview: objectUrl });

    setDialogOpen(false);
  };

  const handleRemove = () => {
    if (field.value?.preview?.startsWith('blob:')) {
      URL.revokeObjectURL(field.value.preview);
    }
    field.onChange(null);
  };

  useEffect(() => {
    if (fileId && fileId !== previousFileIdRef.current) {
      setDialogOpen(true);
      setZoom(1);
      setCroppedAreaPixels(null);
    }
    previousFileIdRef.current = fileId;
  }, [fileId]);

  return (
    <div className='space-y-2'>
      <div className='flex flex-col items-center justify-center gap-y-5'>
        {label && (
          <FormLabel className={cn('ml-2 gap-2', labelClassName)}>
            {label}
            {required && <span className='text-red-500'>*</span>}
          </FormLabel>
        )}
        <div className='relative inline-flex'>
          <button
            type='button'
            className='border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none'
            onClick={openFileDialog}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            title={translate.formatMessage('UploadAvatarField.uploadImage')}
            data-dragging={isDragging || undefined}
            aria-label={field.value ? 'Change image' : 'Upload image'}
          >
            {field.value?.preview ? (
              <img
                src={field.value.preview}
                alt='Avatar'
                className='size-full object-cover'
              />
            ) : (
              <CircleUserRoundIcon className='size-4 opacity-60' />
            )}
          </button>

          {field.value && (
            <Button
              onClick={handleRemove}
              size='icon'
              type='button'
              className='border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none'
            >
              <XIcon className='size-3.5' />
            </Button>
          )}

          <input {...getInputProps()} className='sr-only' tabIndex={-1} />
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='gap-0 p-0 sm:max-w-140 *:[button]:hidden'>
          <DialogDescription className='sr-only'>
            {translate.formatMessage('UploadAvatarField.cropImage')}
          </DialogDescription>
          <DialogHeader className='contents text-left'>
            <DialogTitle className='flex items-center justify-between border-b p-4 text-base'>
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='-my-1 opacity-60'
                  onClick={() => setDialogOpen(false)}
                >
                  <ArrowLeftIcon />
                </Button>
                <span>
                  {translate.formatMessage('UploadAvatarField.cropImage')}
                </span>
              </div>
              <Button
                type='button'
                className='-my-1'
                onClick={handleApply}
                disabled={!previewUrl}
              >
                {translate.formatMessage('UploadAvatarField.apply')}
              </Button>
            </DialogTitle>
          </DialogHeader>

          {previewUrl && (
            <Cropper
              className='h-96 sm:h-120'
              image={previewUrl}
              zoom={zoom}
              onCropChange={handleCropChange}
              onZoomChange={setZoom}
            >
              <CropperDescription />
              <CropperImage />
              <CropperCropArea />
            </Cropper>
          )}

          <DialogFooter className='border-t px-4 py-6'>
            <div className='mx-auto flex w-full max-w-80 items-center gap-4'>
              <ZoomOutIcon className='shrink-0 opacity-60' size={16} />
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(val) => setZoom(val[0])}
              />
              <ZoomInIcon className='shrink-0 opacity-60' size={16} />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
