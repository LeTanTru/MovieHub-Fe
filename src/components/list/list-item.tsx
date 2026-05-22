import { type Ref, type HTMLAttributes } from 'react';

type ListItemProps = HTMLAttributes<HTMLLIElement>;

export function ListItem({
  children,
  ref,
  ...props
}: ListItemProps & { ref?: Ref<HTMLLIElement> }) {
  return (
    <li ref={ref} {...props}>
      {children}
    </li>
  );
}

ListItem.displayName = 'ListItem';
