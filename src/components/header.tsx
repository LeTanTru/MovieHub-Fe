import DarkModeToggle from '@/components/dark-mode-toggle';
import LocaleSwitcher from '@/components/locale-switcher';
import { Link } from '@/i18n/navigation';

export default function Header() {
  return (
    <div>
      <LocaleSwitcher />
      <DarkModeToggle />
      <Link href='/login' className='text-2xl font-bold'>
        Login
      </Link>
    </div>
  );
}
