import type { ComponentType } from 'react';

export type SubmenuProps = {
  href?: string;
  label: string;
  key: string;
  icon?: ComponentType<{ className?: string }>;
};

export type ItemProps = {
  href?: string;
  label: string;
  submenu?: boolean;
  type?: string;
  subItems?: SubmenuProps[];
  isDropdown?: boolean;
  isNew?: boolean;
  key: string;
};
