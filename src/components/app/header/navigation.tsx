'use client';

import { useCategoryQuery } from '@/queries/use-category';
import { ItemProps } from '@/types';
import route from '@/routes';
import NavigationDesktop from './navigation/navigation-desktop';
import NavigationMobile from './navigation/navigation-mobile';

export default function NavigationMenu() {
  const categories = useCategoryQuery();

  const navigationList: ItemProps[] = [
    {
      label: 'Chủ đề',
      href: route.topic
    },
    {
      label: 'Thể loại',
      submenu: true,
      href: '',
      subItems: categories.map((category) => ({
        label: category.name,
        href: `${route.category}/${category.slug}`
      })),
      isGrid: true
    },
    {
      label: 'Phim lẻ',
      href: `${route.movie.type.single}`
    },
    {
      label: 'Phim bộ',
      href: `${route.movie.type.series}`
    },
    {
      label: 'Quốc gia',
      submenu: true,
      subItems: [
        { href: `${route.country}/` + 'an-do', label: 'Ấn Độ' },
        { href: `${route.country}/` + 'anh', label: 'Anh' },
        { href: `${route.country}/` + 'canada', label: 'Canada' },
        { href: `${route.country}/` + 'duc', label: 'Đức' },
        { href: `${route.country}/` + 'han-quoc', label: 'Hàn Quốc' },
        { href: `${route.country}/` + 'hong-kong', label: 'Hồng Kông' },
        { href: `${route.country}/` + 'indonesia', label: 'Indonesia' },
        { href: `${route.country}/` + 'italia', label: 'Italia' },
        { href: `${route.country}/` + 'my', label: 'Mỹ' },
        { href: `${route.country}/` + 'nga', label: 'Nga' },
        { href: `${route.country}/` + 'nhat-ban', label: 'Nhật Bản' },
        { href: `${route.country}/` + 'phap', label: 'Pháp' },
        { href: `${route.country}/` + 'thai-lan', label: 'Thái Lan' },
        { href: `${route.country}/` + 'trung-quoc', label: 'Trung Quốc' },
        { href: `${route.country}/` + 'uc', label: 'Úc' },
        { href: `${route.country}/` + 'viet-nam', label: 'Việt Nam' }
      ],
      isGrid: false
    },
    {
      label: 'Diễn viên',
      href: route.person
    },
    {
      label: 'Lịch chiếu',
      href: route.schedule
    }
  ];

  return (
    <>
      {/* Mobile menu */}
      <NavigationMobile navigationList={navigationList} />
      {/* Desktop menu */}
      <NavigationDesktop navigationList={navigationList} />
    </>
  );
}
