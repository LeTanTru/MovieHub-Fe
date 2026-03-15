import { footerIcon, logoWithText, vnFlag } from '@/assets';
import { route } from '@/routes';
import Image from 'next/image';
import Link from 'next/link';
import { FaTelegramPlane } from 'react-icons/fa';
import {
  FaDiscord,
  FaFacebook,
  FaInstagram,
  FaRegCopyright,
  FaThreads,
  FaTiktok,
  FaXTwitter,
  FaYoutube
} from 'react-icons/fa6';
import type { IconType } from 'react-icons/lib';

export default function Footer() {
  const socialLinks: { key: string; icon: IconType; url: string }[] = [
    {
      key: 'telegram',
      icon: FaTelegramPlane,
      url: '#'
    },
    {
      key: 'discord',
      icon: FaDiscord,
      url: '#'
    },
    {
      key: 'twitter',
      icon: FaXTwitter,
      url: '#'
    },
    {
      key: 'facebook',
      icon: FaFacebook,
      url: '#'
    },
    {
      key: 'tiktok',
      icon: FaTiktok,
      url: '#'
    },
    {
      key: 'youtube',
      icon: FaYoutube,
      url: '#'
    },
    {
      key: 'threads',
      icon: FaThreads,
      url: '#'
    },
    {
      key: 'instagram',
      icon: FaInstagram,
      url: '#'
    }
  ];

  const infoLinks: { key: string; title: string; url: string }[] = [
    {
      key: 'faq',
      title: 'Hỏi đáp',
      url: '#'
    },
    {
      key: 'privacy-policy',
      title: 'Chính sách bảo mật',
      url: '#'
    },
    {
      key: 'terms-of-use',
      title: 'Điều khoản sử dụng',
      url: '#'
    },
    {
      key: 'introduction',
      title: 'Giới thiệu',
      url: '#'
    },
    {
      key: 'contact',
      title: 'Liên hệ',
      url: '#'
    }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-lyla'>
      <div className='max-1600:px-5 max-w-475 px-12.5'>
        <div className='max-1600:px-8 max-1120:justify-center max-1120:py-12 max-640:py-8 max-640:px-0 max-640:text-[13px] max-520:text-xs relative flex min-h-100 items-center justify-between py-8'>
          <div className='max-1600:hidden absolute top-1/2 left-1/2 z-10 h-full w-150 -translate-x-1/2 -translate-y-1/2'>
            <Image
              src={footerIcon.src}
              alt='Footer Icon'
              width={500}
              height={700}
              decoding='async'
              loading='lazy'
              className='h-full'
            />
          </div>
          <div className='max-1120:w-full max-1120:text-center relative z-2 block max-w-187.5'>
            <div className='max-1120:mb-4 mb-6'>
              <div className='bg-vn-flag inline-flex items-center justify-center gap-2 rounded-4xl px-3 py-2 text-white'>
                <div className='h-5 w-5 shrink-0'>
                  <Image
                    src={vnFlag.src}
                    alt='Vietnam Flag'
                    width={20}
                    height={20}
                    decoding='async'
                    loading='lazy'
                  />
                </div>
                <span>Hoàng Sa &amp; Trường Sa là của Việt Nam !</span>
              </div>
            </div>
            <div className='max-1120:flex-col max-1120:gap-8 max-800:gap-8 max-640:gap-4 max-800:mb-6 mb-8 inline-flex items-center gap-12'>
              <Link href={route.home.path} className='max-1120:mb-2 shrink-0'>
                <Image
                  src={logoWithText.src}
                  alt='Logo'
                  width={500}
                  height={600}
                  decoding='async'
                  loading='lazy'
                  className='h-15 w-auto'
                  unoptimized
                />
              </Link>
              <div className='max-1120:border-none max-480:grid max-1120:grid-cols-4 max-1120:pl-0 max-1120:justify-center flex items-center gap-3 border-l border-solid pl-12'>
                {socialLinks.map(({ key, icon: Icon, url }) => (
                  <Link
                    key={key}
                    href={url}
                    className='bg-charade flex size-10 items-center justify-center rounded-full'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Icon className='size-3.5 shrink-0' />
                  </Link>
                ))}
              </div>
            </div>
            <div className='max-1120:justify-center max-1120:flex-wrap mb-4 flex gap-4'>
              {infoLinks.map(({ key, title, url }) => (
                <Link
                  className='hover:text-golden-glow transition-all duration-200 ease-linear'
                  href={url}
                  key={key}
                >
                  {title}
                </Link>
              ))}
            </div>
            <div className='mb-2 text-justify leading-normal text-gray-400'>
              MovieHub - Trang xem phim online chất lượng cao miễn phí Vietsub,
              thuyết minh, lồng tiếng full HD. Kho phim mới khổng lồ, phim chiếu
              rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam, Hàn Quốc,
              Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ… đa dạng thể loại. Khám phá
              nền tảng phim trực tuyến hay nhất {currentYear} chất lượng 4K!
            </div>
            <div className='flex items-center gap-2 text-gray-400'>
              <FaRegCopyright /> {currentYear} MovieHub
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
