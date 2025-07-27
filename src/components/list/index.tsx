interface ListProps {
  children: React.ReactNode;
  [key: string]: any;
}

export default function List({ children, ...props }: ListProps) {
  return <ul {...props}>{children}</ul>;
}
