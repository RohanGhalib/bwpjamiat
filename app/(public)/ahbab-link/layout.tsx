import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Ahbab Alumni Portal | IJT Bahawalpur',
  description: 'A dedicated portal for IJT Bahawalpur alumni to reconnect, network, and contribute to the student movement.',
  path: '/ahbab-link',
  noIndex: true,
});

export default function AhbabLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
