export default function Container({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return <main {...props}>{children}</main>;
}
