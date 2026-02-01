'use client';

import { Button } from '@/components/form';
import Link from 'next/link';
import { FaPlay } from 'react-icons/fa';

export default function ButtonWatchNow({
  href,
  className
}: {
  href: string;
  className?: string;
}) {
  return (
    <Link href={href}>
      <Button className={className}>
        <FaPlay />
        Xem ngay
      </Button>
    </Link>
  );
}
