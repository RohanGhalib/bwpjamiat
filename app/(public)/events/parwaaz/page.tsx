import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import ParwaazClient from './ParwaazClient';

export const metadata: Metadata = buildMetadata({
  title: 'Parwaaz Career Counselling Seminar - IJT Bahawalpur',
  description: 'Register for the Parwaaz Career Counselling Seminar in Bahawalpur. Find direction, options, and guidance for your university admission and career after Intermediate.',
  path: '/events/parwaaz',
  keywords: [
    'Parwaaz Seminar',
    'Career Counselling Bahawalpur',
    'IJT Bahawalpur events',
    'student counseling Bahawalpur',
    'E-Library Dring Stadium event',
    'counseling after FSc'
  ],
});

export default function ParwaazEventPage() {
  return <ParwaazClient />;
}
