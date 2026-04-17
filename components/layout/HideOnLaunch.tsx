'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function HideOnLaunch({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Hide the wrapped element entirely on the /launch route
  if (pathname === '/launch') {
    return null;
  }
  
  return <>{children}</>;
}
