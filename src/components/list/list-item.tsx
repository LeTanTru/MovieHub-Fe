import { forwardRef, type Ref, type HTMLAttributes } from 'react';

type ListItemProps = HTMLAttributes<HTMLLIElement>;

const ListItem = forwardRef(
  ({ children, ...props }: ListItemProps, ref: Ref<HTMLLIElement>) => {
    return (
      <li ref={ref} {...props}>
        {children}
      </li>
    );
  }
);

ListItem.displayName = 'ListItem';

export default ListItem;
