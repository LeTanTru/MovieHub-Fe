'use client';

import { AndroidIcon } from '@/assets/icons/android';
import { Modal } from '@/components/modal';
import { AppVersionLatestResType } from '@/types';
import { renderFileUrl } from '@/utils';
import { Download, QrCode, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

type DownloadAppModalProps = {
  open: boolean;
  appVersion: AppVersionLatestResType;
  onClose: () => void;
};

export function DownloadAppModal({
  open,
  appVersion,
  onClose
}: DownloadAppModalProps) {
  const safeVersionName =
    appVersion.name
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') || 'latest';
  const downloadFileName = `moviehub_${safeVersionName}.apk`;
  const rawDownloadUrl = renderFileUrl(appVersion.filePath);
  const separator = rawDownloadUrl.includes('?') ? '&' : '?';
  const downloadUrl = `${rawDownloadUrl}${separator}downloadFileName=${encodeURIComponent(downloadFileName)}`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      className='bg-vintage-navi max-768:w-140 max-640:w-[calc(100%-24px)] top-1/2 left-1/2 mx-0 w-136 -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-2xl shadow-black/50'
    >
      <Modal.Header className='absolute top-3 right-3 z-10 justify-end p-0'>
        <span className='sr-only'>Đóng modal tải ứng dụng MovieHub</span>
      </Modal.Header>
      <Modal.Body className='relative overflow-hidden p-0'>
        <div className='pointer-events-none absolute inset-0'>
          <div className='bg-golden-glow/18 absolute top-0 right-0 h-36 w-36 rounded blur-3xl' />
          <div className='bg-dark-conflower-blue/30 absolute bottom-0 left-0 h-40 w-40 rounded blur-3xl' />
        </div>

        <div className='max-640:p-5 relative p-6 text-white'>
          <div className='max-640:mb-5 mb-6'>
            <div className='space-y-3 text-center'>
              <div className='inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs font-medium tracking-[0.2em] text-white/75 uppercase'>
                <Smartphone className='size-3.5' />
                Ứng dụng di động
              </div>
              <div className='flex flex-col items-center space-y-2'>
                <h2 className='max-640:text-xl text-2xl leading-tight font-semibold'>
                  Tải ứng dụng MovieHub
                </h2>
                <p className='max-w-xs text-sm leading-6 text-white/70'>
                  Quét mã QR để tải nhanh trên điện thoại hoặc dùng liên kết tải
                  xuống bên dưới.
                </p>
                <div className='flex items-center gap-2'>
                  <span className='rounded-full bg-black/20 px-3 py-1 text-sm font-medium text-white/85'>
                    {appVersion.name}
                  </span>
                  <div className='flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium'>
                    <AndroidIcon />
                    <span className='text-white/70'>Android</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='max-640:grid-cols-1 max-640:p-4 grid grid-cols-[minmax(0,1fr)_220px] items-center gap-5 rounded-lg bg-black/18 p-5 backdrop-blur-sm'>
            <div className='max-640:flex max-640:flex-col max-640:items-center space-y-4'>
              <div className='flex items-center gap-2 text-sm font-medium text-white/80'>
                <QrCode className='text-golden-glow size-4' />
                Quét để tải bản mới nhất
              </div>
              <div className='space-y-2 text-justify'>
                <p className='text-base leading-7 text-white/90'>
                  Mở camera hoặc ứng dụng quét mã trên điện thoại để bắt đầu tải
                  xuống.
                </p>
                <p className='text-sm leading-6 text-white/60'>
                  Nếu thiết bị không quét được mã, bạn vẫn có thể tải xuống bằng
                  nút bên dưới.
                </p>
              </div>

              <a
                href={downloadUrl}
                download={downloadFileName}
                target='_blank'
                rel='noreferrer'
                className='bg-golden-glow hover:bg-golden-tainoi max-640:mx-auto inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-black transition'
              >
                <Download className='size-4' />
                Tải xuống
              </a>
            </div>

            <div className='mx-auto rounded-2xl bg-white p-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)]'>
              <QRCodeSVG value={downloadUrl} size={188} />
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
