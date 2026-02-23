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

export default function Footer() {
  const socialLinks = [
    {
      icon: FaTelegramPlane,
      url: '#'
    },
    {
      icon: FaDiscord,
      url: '#'
    },
    {
      icon: FaXTwitter,
      url: '#'
    },
    {
      icon: FaFacebook,
      url: '#'
    },
    {
      icon: FaTiktok,
      url: '#'
    },
    {
      icon: FaYoutube,
      url: '#'
    },
    {
      icon: FaThreads,
      url: '#'
    },
    {
      icon: FaInstagram,
      url: '#'
    }
  ];

  const infoLinks = [
    {
      title: 'Hỏi đáp',
      url: '#'
    },
    {
      title: 'Chính sách bảo mật',
      url: '#'
    },
    {
      title: 'Điều khoản sử dụng',
      url: '#'
    },
    {
      title: 'Giới thiệu',
      url: '#'
    },
    {
      title: 'Liên hệ',
      url: '#'
    }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-lyla'>
      <div className='max-w-475 px-12.5'>
        <div className='relative flex min-h-100 items-center justify-between py-8'>
          <div className='absolute top-1/2 left-1/2 z-10 h-full w-150 -translate-x-1/2 -translate-y-1/2'>
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
          <div className='relative z-2 block max-w-187.5'>
            <div className='mb-6'>
              <div className='bg-vn-flag inline-flex justify-center gap-2 rounded-4xl px-3 py-2 text-white'>
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
            <div className='mb-8 inline-flex items-center gap-12'>
              <Link href={route.home.path} className='shrink-0'>
                <Image
                  src={logoWithText.src}
                  alt='Logo'
                  width={500}
                  height={600}
                  decoding='async'
                  loading='lazy'
                  className='h-15 w-auto'
                />
              </Link>
              <div className='border-500-200 flex items-center gap-3 border-l border-solid pl-12'>
                {socialLinks.map(({ icon: Icon, url }, index) => (
                  <Link
                    key={index}
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
            <div className='mb-4 flex gap-4'>
              {infoLinks.map(({ title, url }, index) => (
                <Link
                  className='hover:text-golden-glow transition-all duration-200 ease-linear'
                  href={url}
                  key={index}
                >
                  {title}
                </Link>
              ))}
            </div>
            <div className='mb-2 leading-normal text-gray-400'>
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
