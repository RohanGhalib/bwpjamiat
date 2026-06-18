import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import ComplaintFormClient from './ComplaintFormClient';

export const metadata: Metadata = buildMetadata({
  title: 'Student Complaint Cell - IJT Bahawalpur',
  description: 'Official Student Complaint Cell for Bahawalpur students. Submit your queries, concerns, and academic complaints directly to Islami Jamiat-e-Talaba.',
  path: '/complaintcell',
  keywords: ['IJT Bahawalpur', 'Student Complaint Cell', 'Bahawalpur student complaints', 'Islamia University Bahawalpur complaints'],
});

export default function ComplaintCellPage() {
  return <ComplaintFormClient />;
}
