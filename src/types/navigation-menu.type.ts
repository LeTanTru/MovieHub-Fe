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
  isDropdown?: boolean;
  isNew?: boolean;
};
