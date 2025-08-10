export type SubmenuProps = {
  href?: string;
  label?: string;
  [key: string]: any;
};

export type ItemProps = {
  href?: string;
  label: string;
  submenu?: boolean;
  type?: string;
  subItems?: SubmenuProps[];
};

export type NavigationProps = {
  className?: string;
  navListClassName?: string;
  navItemClassName?: string;
  items: ItemProps[];
  render: (item: ItemProps, index: number) => React.ReactNode;
};
