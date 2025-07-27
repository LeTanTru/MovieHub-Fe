interface ListItemProps {
  children: React.ReactNode;
  [key: string]: any;
}

export default function ListItem({ children, ...props }: ListItemProps) {
  return <li {...props}>{children}</li>;
}
