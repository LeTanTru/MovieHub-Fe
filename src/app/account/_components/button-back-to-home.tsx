import { Button, ToolTip } from '@/components/form';
import { route } from '@/routes';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa6';

export default function ButtonBackToHome() {
  return (
    <ToolTip title='Quay lại trang chủ' side='bottom'>
      <Button asChild variant='ghost' className='absolute left-0'>
        <Link href={route.home.path}>
          <FaChevronLeft />
        </Link>
      </Button>
    </ToolTip>
  );
}
