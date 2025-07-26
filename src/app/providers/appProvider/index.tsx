import { IChildren } from '@/interfaces';

export default function AppProvider({ children }: IChildren) {
  return <div>{children}</div>;
}
