import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Join IJT | IJT Bahawalpur',
  description: 'Register as a volunteer and join the largest student movement in Pakistan - Islami Jamiat-e-Talaba Bahawalpur.',
  path: '/contact',
  keywords: ['join IJT', 'student organization Bahawalpur', 'IJT volunteer'],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
