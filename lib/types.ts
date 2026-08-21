// Shared Types for Jamiat Bahawalpur (Expected Developer Model)

export interface Event {
  id: string;
  title: string;
  date: string; // ISO string
  time: string;
  venue: string;
  type: 'Convention' | 'Camp' | 'Study Circle' | 'Meeting';
  description: string;
  posterUrl: string;
  attendanceCount?: number;
  gallery: string[]; // URLs to photos
  eventCategory?: 'standard' | 'dedicated';
  dedicatedPath?: string;
  pageRef?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown
  authorName: string;
  authorRole: string;
  publishDate: string;
  category: 'Tarbiyah' | 'Current Affairs' | 'Seerat' | 'General';
  thumbnailUrl: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
  readTime?: string;
}

export interface Tarana {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audioUrl: string;
  coverUrl?: string;
  tags: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessonsCount: number;
  thumbnailUrl?: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'Video' | 'PDF' | 'Audio';
  url: string;
  duration?: string; // For audio/video
}

export interface AlumniProfile {
  id: string;
  name: string;
  batchYear: number;
  city: string;
  profession: string;
  avatarUrl?: string;
}

export interface EmberMember {
  id: string;
  name: string;
  role: string;
  department: string;
  img: string;
  gender: 'boy' | 'girl';
  order: number;
  email?: string;
  phone?: string;
}

export type ContactSource = 
  | 'quran_club'
  | 'volunteer'
  | 'summer_school'
  | 'event'
  | 'contact_form'
  | 'complaint'
  | 'ember'
  | 'manual';

export type ContactStatus = 'lead' | 'active' | 'approved' | 'archived';

export interface CentralContact {
  id: string;
  name: string;
  email?: string;
  phone: string; // WhatsApp or Phone number (Normalized)
  city?: string;
  institution?: string; // University, College, or School
  source: ContactSource;
  sourceEventId?: string;
  sourceEventTitle?: string;
  tags: string[];
  status: ContactStatus;
  customFields?: Record<string, unknown>;
  isSubscribedToEmail?: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

