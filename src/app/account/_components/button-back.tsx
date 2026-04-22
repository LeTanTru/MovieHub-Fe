'use client';

import { Button, ToolTip } from '@/components/form';
import { storageKeys } from '@/constants';
import { useNavigate } from '@/hooks';
import { route } from '@/routes';
import { getData } from '@/utils';
import { FaChevronLeft } from 'react-icons/fa6';

export default function ButtonBack() {
  const navigate = useNavigate();
  const handleClick = () => {
    const previousPath = getData(storageKeys.PREVIOUS_PATH) || route.home.path;
    navigate.push(previousPath);
  };

  return (
    <ToolTip title='Quay lại trang trước' side='bottom'>
      <Button onClick={handleClick} variant='ghost' className='absolute left-0'>
        <FaChevronLeft />
      </Button>
    </ToolTip>
  );
}
