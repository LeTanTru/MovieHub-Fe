'use client';

import { ItemProps } from '@/types';
import NavigationDesktop from './navigation/navigation-desktop';
import NavigationMobile from './navigation/navigation-mobile';
import { useCategoryListQuery } from '@/queries';
import { route } from '@/routes';

export default function NavigationMenu() {
  const categories = useCategoryListQuery();

  const navigationList: ItemProps[] = [
    {
      label: 'Chủ đề',
      href: route.topic.path
    },
    {
      label: 'Thể loại',
      submenu: true,
      href: '',
      subItems: (categories.data?.data.content || []).map((category) => ({
        label: category.name,
        href: `${route.category.path}/${category.slug}.${category.id}`
      })),
      isGrid: true
    },
    {
      label: 'Phim lẻ',
      href: `${route.movieType.single.path}`
    },
    {
      label: 'Phim bộ',
      href: `${route.movieType.series.path}`
    },
    {
      label: 'Quốc gia',
      submenu: true,
      subItems: [
        { href: `${route.country.path}/` + 'an-do', label: 'Ấn Độ' },
        { href: `${route.country.path}/` + 'anh', label: 'Anh' },
        { href: `${route.country.path}/` + 'canada', label: 'Canada' },
        { href: `${route.country.path}/` + 'duc', label: 'Đức' },
        { href: `${route.country.path}/` + 'han-quoc', label: 'Hàn Quốc' },
        { href: `${route.country.path}/` + 'hong-kong', label: 'Hồng Kông' },
        { href: `${route.country.path}/` + 'indonesia', label: 'Indonesia' },
        { href: `${route.country.path}/` + 'italia', label: 'Italia' },
        { href: `${route.country.path}/` + 'my', label: 'Mỹ' },
        { href: `${route.country.path}/` + 'nga', label: 'Nga' },
        { href: `${route.country.path}/` + 'nhat-ban', label: 'Nhật Bản' },
        { href: `${route.country.path}/` + 'phap', label: 'Pháp' },
        { href: `${route.country.path}/` + 'thai-lan', label: 'Thái Lan' },
        { href: `${route.country.path}/` + 'trung-quoc', label: 'Trung Quốc' },
        { href: `${route.country.path}/` + 'uc', label: 'Úc' },
        { href: `${route.country.path}/` + 'viet-nam', label: 'Việt Nam' }
      ],
      isGrid: false
    },
    {
      label: 'Diễn viên',
      href: route.person.path
    },
    {
      label: 'Lịch chiếu',
      href: route.schedule.path
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
