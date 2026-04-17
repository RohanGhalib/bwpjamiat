"use client";

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function HideOnLaunch({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During hydration, render null for /launch, otherwise render children.
  // After hydration, dynamically respond to pathname.
  // This prevents hydration mismatches and reliably hides on the launch page.
  if (pathname === '/launch') {
    return null;
  }

  // To prevent the "pop-in" from being too abrupt when navigating from /launch 
  // you can either just return children natively or apply an animation class on the children.
  // We'll leave it as a fragment so it doesn't break fixed positioning (like Header).
  return <>{children}</>;
}
