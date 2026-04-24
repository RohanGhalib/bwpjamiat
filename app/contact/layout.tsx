import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join IJT | IJT Bahawalpur',
  description: 'Register as a volunteer and join the largest student movement in Pakistan — Islami Jamiat-e-Talaba Bahawalpur.',
  openGraph: {
    title: 'Join the Revolution | IJT Bahawalpur',
    description: 'Become a part of Islami Jamiat-e-Talaba Bahawalpur — the largest student movement in Pakistan.',
    url: 'https://bwpjamiat.vercel.app/contact',
    siteName: 'IJT Bahawalpur',
    locale: 'en_PK',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
