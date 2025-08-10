'use client';

import { useParams } from 'next/navigation';

export default function CountryList() {
  const params = useParams<{ slug: string }>();
  return <div>{params.slug}</div>;
}
