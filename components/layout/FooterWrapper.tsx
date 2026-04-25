"use client";

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

function FooterContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return <>{children}</>;
}

export default function FooterWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <FooterContent>{children}</FooterContent>
    </Suspense>
  );
}
