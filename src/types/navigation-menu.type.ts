type SubmenuProps = {
  href?: string;
  label?: string;
  [key: string]: any;
};

type ItemProps = {
  href?: string;
  label: string;
  submenu?: boolean;
  type?: string;
  subItems?: SubmenuProps[];
};

type NavigationProps = {
  className?: string;
  navListClassName?: string;
  navItemClassName?: string;
  items: ItemProps[];
  render: (item: ItemProps, index: number) => React.ReactNode;
};

export type { SubmenuProps, ItemProps, NavigationProps };
