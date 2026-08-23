'use client';

import { ReactNode } from 'react';
import NotificationManager from '@/components/common/NotificationManager';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <NotificationManager />
      {children}
    </>
  );
}
