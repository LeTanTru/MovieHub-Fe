export type DropdownAvatarItemType = {
  link: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  className?: string;
};

export type UserSidebarItemType = {
  link: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  className?: string;
};

export type OptionType = {
  value: string | number;
  label: string;
  [key: string]: string | number;
};
