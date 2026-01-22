'use client';

import { Activity as BaseActivity, ReactNode } from 'react';

export default function Activity({
  visible,
  children
}: {
  visible: boolean;
  children: ReactNode;
}) {
  return (
    <BaseActivity mode={visible ? 'visible' : 'hidden'}>
      {children}
    </BaseActivity>
  );
}
