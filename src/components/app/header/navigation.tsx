'use client';

import { ItemProps } from '@/types';
import NavigationDesktop from './navigation/navigation-desktop';
import NavigationMobile from './navigation/navigation-mobile';
import { useCategoryListQuery } from '@/queries';
import { route } from '@/routes';
import { countryOptions } from '@/constants';

export default function NavigationMenu() {
  const { data: categoryListData } = useCategoryListQuery();

  const navigationList: ItemProps[] = [
    {
      label: 'Chủ đề',
      href: route.topic.path
    },
    {
      label: 'Thể loại',
      submenu: true,
      href: '',
      subItems: (categoryListData?.data.content || [])
        .map((category) => ({
          label: category.name,
          href: `${route.category.path}/${category.slug}.${category.id}`
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
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
      subItems: countryOptions.map((country) => ({
        href: `${route.country.path}/${country.value}`,
        label: country.label
      })),
      isGrid: true
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
