import { Slider } from '@/app/(home)/_components/slider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  description:
    'Xem phim trực tuyến miễn phí với chất lượng cao tại MovieHub. Khám phá kho phim đa dạng, từ hành động, hài hước đến lãng mạn. Trải nghiệm xem phim mượt mà trên mọi thiết bị, không quảng cáo phiền phức. Cập nhật phim mới hàng ngày, đảm bảo bạn luôn có những lựa chọn giải trí tốt nhất. Thưởng thức thế giới điện ảnh tại MovieHub ngay hôm nay !'
};

export default async function HomePage() {
  return (
    <>
      <Slider />
      <div className='max-1919:px-5 max-1600:pt-28 max-1360:pt-20 max-990:pb-24 max-800:pt-8 min-h-[calc(100vh-400px)] px-12.5 pt-40 pb-40 max-sm:px-4'></div>
    </>
  );
}
