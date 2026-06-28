'use client';

import { useCallback, useEffect, useState } from 'react';
import { ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import {
  Cropper,
  CropperCropArea,
  CropperDescription,
  CropperImage
} from '@/components/ui/cropper';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from './button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Image from 'next/image';
import { cn } from '@/lib';
import { logger } from '@/logger';

const ASPECT_RATIOS = [
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9', value: 16 / 9 },
  { label: '9:16', value: 9 / 16 },
  { label: '3:2', value: 3 / 2 },
  { label: '2:3', value: 2 / 3 }
] as const;

const ZOOM_ICON_SIZE = 16;
const ZOOM_SLIDER_MIN = 1;
const ZOOM_SLIDER_MAX = 3;
const ZOOM_SLIDER_STEP = 0.01;

type Area = { x: number; y: number; width: number; height: number };

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  outputType?: string
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
      canvas.toBlob((blob) => resolve(blob), outputType || 'image/jpeg');
    });
  } catch (error) {
    logger.error('[GET_CROPPED_IMAGE_ERROR]', error);
    return null;
  }
}

type ImageCropperDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewUrl: string | null;
  file: File | null;
  aspect?: number;
  defaultCrop?: boolean;
  originalSize?: boolean;
  allowCustomAspect?: boolean;
  onConfirm: (blob: Blob, keepOriginal: boolean) => Promise<void>;
};

export function ImageCropperDialog({
  open,
  onOpenChange,
  previewUrl,
  file,
  aspect = 1,
  defaultCrop = false,
  originalSize = false,
  allowCustomAspect = false,
  onConfirm
}: ImageCropperDialogProps) {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [shouldCrop, setShouldCrop] = useState<boolean>(
    defaultCrop && !originalSize
  );
  const [zoom, setZoom] = useState<number>(1);
  const [customAspect, setCustomAspect] = useState<number>(aspect);
  const [keepOriginalSize, setKeepOriginalSize] =
    useState<boolean>(originalSize);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setZoom(1);
      setCroppedAreaPixels(null);
      setCustomAspect(aspect);
      setShouldCrop(defaultCrop && !originalSize);
      setKeepOriginalSize(originalSize);
    }
  }, [open, aspect, defaultCrop, originalSize]);

  const handleCropChange = useCallback((pixels: Area | null) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = async () => {
    if (!previewUrl || !onConfirm) return;

    const outputType = file?.type || 'image/jpeg';

    let blob: Blob | null = null;

    try {
      setIsUploading(true);

      if (shouldCrop && croppedAreaPixels) {
        blob = await getCroppedImg(previewUrl, croppedAreaPixels, outputType);
      } else if (file) {
        blob = file;
      } else {
        const image = await createImage(previewUrl);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        blob = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b), outputType)
        );
      }

      if (blob) {
        await onConfirm(blob, keepOriginalSize);
      }
    } catch (error) {
      logger.error('[CROP_APPLY_ERROR]', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(op) => {
        if (isUploading) return;
        onOpenChange(op);
      }}
    >
      <DialogContent
        className='bg-accent gap-0 overflow-hidden rounded-tl-sm rounded-tr-sm border-none p-0 sm:max-w-85 md:max-w-90 lg:max-w-95 xl:max-w-100 2xl:max-w-115'
        showCloseButton={false}
      >
        <DialogHeader className='text-left'>
          <DialogTitle className='border-none p-0 outline-none'></DialogTitle>
        </DialogHeader>

        <AspectRatio
          ratio={customAspect < 1 ? 1 : customAspect}
          className={cn('bg-muted h-full', {
            'bg-black': keepOriginalSize && !shouldCrop
          })}
        >
          {previewUrl && shouldCrop ? (
            <Cropper
              aspectRatio={customAspect}
              className='h-full w-full'
              image={previewUrl}
              zoom={zoom}
              onCropChange={handleCropChange}
              onZoomChange={setZoom}
            >
              <CropperDescription />
              <CropperImage />
              <CropperCropArea className='border-light-gray border-2' />
            </Cropper>
          ) : (
            previewUrl && (
              <Image
                fill
                src={previewUrl}
                alt='Preview'
                className={cn('h-full w-full', {
                  'object-contain': keepOriginalSize && !shouldCrop,
                  'object-cover': !keepOriginalSize && shouldCrop
                })}
                sizes='(max-width: 768px) 100vw, 50vw'
              />
            )
          )}
        </AspectRatio>

        <DialogFooter className='flex flex-col flex-wrap gap-4 border-t px-4 py-6 sm:justify-between'>
          {!keepOriginalSize && shouldCrop && (
            <div className='mx-auto flex w-full max-w-80 items-center gap-4'>
              <ZoomOutIcon
                className='shrink-0 opacity-60'
                size={ZOOM_ICON_SIZE}
              />
              <Slider
                value={[zoom]}
                min={ZOOM_SLIDER_MIN}
                max={ZOOM_SLIDER_MAX}
                step={ZOOM_SLIDER_STEP}
                onValueChange={(val) => setZoom(val[0])}
                showTooltip
                className='cursor-pointer [&_span[role="slider"]]:border-none [&_span[role="slider"]]:bg-black'
                trackClassName='bg-gray-500'
              />
              <ZoomInIcon
                className='shrink-0 opacity-60'
                size={ZOOM_ICON_SIZE}
              />
            </div>
          )}

          {allowCustomAspect && shouldCrop && (
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground text-sm'>
                Tỉ lệ khung hình:
              </span>
              <Select
                value={customAspect.toString()}
                onValueChange={(val) => setCustomAspect(parseFloat(val))}
              >
                <SelectTrigger className='w-24'>
                  <SelectValue placeholder='Chọn tỉ lệ' />
                </SelectTrigger>
                <SelectContent>
                  {ASPECT_RATIOS.map((ratio) => (
                    <SelectItem
                      key={ratio.value}
                      value={ratio.value.toString()}
                    >
                      {ratio.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className='flex w-full justify-between'>
            <div className='flex items-center gap-4'>
              <label
                className='flex cursor-pointer items-center gap-2'
                htmlFor='crop-image'
              >
                <Checkbox
                  id='crop-image'
                  className='mb-0! cursor-pointer border-gray-200 border-transparent transition-colors duration-200 ease-linear focus-visible:ring-0 data-[state=checked]:border-transparent data-[state=checked]:bg-sky-700! data-[state=checked]:text-white'
                  checked={shouldCrop}
                  onCheckedChange={(checked) => {
                    setShouldCrop(!!checked);
                    setKeepOriginalSize(!checked);
                    if (!checked) {
                      setZoom(1);
                      setCustomAspect(aspect);
                    }
                  }}
                />
                <span className='text-sm'>Cắt ảnh</span>
              </label>
              {originalSize && (
                <label
                  className='flex cursor-pointer items-center gap-2'
                  htmlFor='keep-original-size'
                >
                  <Checkbox
                    id='keep-original-size'
                    className='mb-0! cursor-pointer border-gray-200 border-transparent transition-colors duration-200 ease-linear focus-visible:ring-0 data-[state=checked]:border-transparent data-[state=checked]:bg-sky-700! data-[state=checked]:text-white'
                    checked={keepOriginalSize}
                    onCheckedChange={(checked) => {
                      setKeepOriginalSize(!!checked);
                      setShouldCrop(!checked);
                      if (checked) {
                        setZoom(1);
                        setCustomAspect(aspect);
                      }
                    }}
                  />
                  <span className='text-sm'>Gốc</span>
                </label>
              )}
            </div>

            <div className='flex items-center justify-center gap-2'>
              <Button
                type='button'
                variant='outline'
                size='icon'
                className='-my-1 w-25 border-rose-500 text-rose-500 hover:border-rose-500/80 hover:text-rose-500/80 disabled:border-rose-500/80'
                onClick={() => onOpenChange(false)}
                disabled={isUploading}
              >
                Đóng
              </Button>
              <Button
                type='button'
                variant='primary'
                className='-my-1 w-25'
                onClick={handleApply}
                disabled={!previewUrl || isUploading}
                loading={isUploading}
              >
                Áp dụng
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
