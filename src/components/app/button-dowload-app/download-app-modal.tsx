'use client';

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
  const downloadUrl = renderFileUrl(appVersion.filePath);

  return (
    <Modal
      open={open}
      onClose={onClose}
      className='bg-vintage-navi max-768:w-140 max-640:w-[calc(100%-24px)] top-1/2 left-1/2 mx-0 w-[34rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border border-white/10 shadow-2xl shadow-black/50'
    >
      <Modal.Header className='absolute top-3 right-3 z-10 justify-end p-0'>
        <span className='sr-only'>Đóng modal tải ứng dụng MovieHub</span>
      </Modal.Header>
      <Modal.Body className='relative overflow-hidden p-0'>
        <div className='pointer-events-none absolute inset-0'>
          <div className='bg-golden-glow/18 absolute top-0 right-0 h-36 w-36 rounded-full blur-3xl' />
          <div className='bg-dark-conflower-blue/30 absolute bottom-0 left-0 h-40 w-40 rounded-full blur-3xl' />
          <div className='absolute inset-x-0 top-0 h-px bg-white/15' />
        </div>

        <div className='max-640:p-5 relative p-6 text-white'>
          <div className='max-640:mb-5 max-640:flex-col max-640:items-start mb-6 flex items-start justify-between gap-4'>
            <div className='space-y-3'>
              <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium tracking-[0.2em] text-white/75 uppercase'>
                <Smartphone className='size-3.5' />
                Ứng dụng di động
              </div>
              <div className='space-y-2'>
                <h2 className='max-640:text-xl text-2xl leading-tight font-semibold'>
                  Tải ứng dụng MovieHub
                </h2>
                <p className='max-w-sm text-sm leading-6 text-white/70'>
                  Quét mã QR để tải nhanh trên điện thoại hoặc dùng liên kết tải
                  trực tiếp bên dưới.
                </p>
              </div>
            </div>

            <div className='max-640:justify-start flex flex-wrap items-center justify-end gap-2'>
              {appVersion.forceUpdate && (
                <span className='border-golden-glow/35 bg-golden-glow/12 text-golden-glow rounded-full border px-3 py-1 text-xs font-semibold'>
                  Cần cập nhật
                </span>
              )}
              <span className='rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm font-medium text-white/85'>
                v{appVersion.name}
              </span>
            </div>
          </div>

          <div className='max-640:grid-cols-1 max-640:p-4 grid grid-cols-[minmax(0,1fr)_220px] items-center gap-5 rounded-[24px] border border-white/10 bg-black/18 p-5 backdrop-blur-sm'>
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-sm font-medium text-white/80'>
                <QrCode className='text-golden-glow size-4' />
                Quét để tải bản mới nhất
              </div>
              <div className='space-y-2'>
                <p className='text-base leading-7 text-white/90'>
                  Mở camera hoặc ứng dụng quét mã trên điện thoại để bắt đầu tải
                  xuống.
                </p>
                <p className='text-sm leading-6 text-white/60'>
                  Nếu thiết bị không quét được mã, bạn vẫn có thể tải trực tiếp
                  bằng nút bên dưới.
                </p>
              </div>

              <a
                href={downloadUrl}
                target='_blank'
                rel='noreferrer'
                className='bg-golden-glow hover:bg-golden-tainoi inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-black transition'
              >
                <Download className='size-4' />
                Tải trực tiếp
              </a>
            </div>

            <div className='mx-auto rounded-[28px] bg-white p-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)]'>
              <QRCodeSVG value={downloadUrl} size={188} />
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
