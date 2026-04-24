import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ahbab Alumni Portal | IJT Bahawalpur',
  description: 'A dedicated portal for IJT Bahawalpur alumni to reconnect, network, and contribute to the student movement.',
  openGraph: {
    title: 'Ahbab Alumni Portal | IJT Bahawalpur',
    description: 'IJT Bahawalpur alumni forum and login portal.',
    url: 'https://bwpjamiat.vercel.app/ahbab-link',
    siteName: 'IJT Bahawalpur',
    locale: 'en_PK',
    type: 'website',
  },
};

export default function AhbabLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
