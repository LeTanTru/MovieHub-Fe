'use client';

import { CategoryResType, ItemProps } from '@/types';
import { useCategoryListQuery } from '@/queries';
import { route } from '@/routes';
import { countries, MAX_PAGE_SIZE } from '@/constants';
import { generateSlug } from '@/utils';
import NavigationMobile from './navigation/navigation-mobile';
import NavigationDesktop from './navigation/navigation-desktop';

export default function NavigationMenu({
  mode
}: {
  mode?: 'mobile' | 'desktop';
}) {
  const { data: categoryListData } = useCategoryListQuery({
    params: {
      size: MAX_PAGE_SIZE
    },
    enabled: true
  });
  const categoryList: CategoryResType[] = categoryListData?.data?.content || [];

  const navigationList: ItemProps[] = [
    {
      label: 'Chủ đề',
      href: route.topic.path
    },
    {
      label: 'Thể loại',
      submenu: true,
      href: '',
      subItems: categoryList
        .map((category) => ({
          label: category.name,
          href: `${route.category.path}/${category.slug}.${category.id}`
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      isDropdown: true
    },
    {
      label: 'Phim lẻ',
      href: `${route.movieType.single.path}`
    },
    {
      label: 'Phim bộ',
      href: `${route.movieType.series.path}`
    },
    // {
    //   label: 'Xem chung',
    //   href: '#',
    //   isNew: true
    // },
    {
      label: 'Quốc gia',
      submenu: true,
      subItems: countries.map((country) => ({
        href: `${route.country.path}/${generateSlug(country.label)}.${country.value}`,
        label: country.label
      })),
      isDropdown: true
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
      {mode === 'mobile' && (
        <NavigationMobile navigationList={navigationList} />
      )}
      {/* Desktop menu */}
      {mode === 'desktop' && (
        <NavigationDesktop navigationList={navigationList} />
      )}
    </>
  );
}
