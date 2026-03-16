'use client';

import { CategoryResType, ItemProps } from '@/types';
import { useCategoryListQuery } from '@/queries';
import { route } from '@/routes';
import { countries, MAX_PAGE_SIZE } from '@/constants';
import { generateSlug } from '@/utils';
import NavigationMobile from './navigation-mobile';
import NavigationDesktop from './navigation-desktop';

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
      href: route.topic.path,
      key: 'topic'
    },
    {
      label: 'Thể loại',
      submenu: true,
      href: '',
      subItems: categoryList
        .map((category) => ({
          href: `${route.category.path}/${category.slug}.${category.id}`,
          key: generateSlug(category.name),
          label: category.name
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      isDropdown: true,
      key: 'category'
    },
    {
      label: 'Phim lẻ',
      href: `${route.movieType.single.path}`,
      key: 'single'
    },
    {
      label: 'Phim bộ',
      href: `${route.movieType.series.path}`,
      key: 'series'
    },
    // {
    //   label: 'Xem chung',
    //   href: '#',
    //   isNew: true,
    //   key: 'watch-together'
    // },
    {
      label: 'Quốc gia',
      submenu: true,
      subItems: countries.map((country) => ({
        href: `${route.country.path}/${generateSlug(country.label)}.${country.value}`,
        key: generateSlug(country.label),
        label: country.label
      })),
      isDropdown: true,
      key: 'country'
    },
    {
      label: 'Diễn viên',
      href: route.person.path,
      key: 'person'
    },
    {
      label: 'Lịch chiếu',
      href: route.schedule.path,
      key: 'schedule'
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
