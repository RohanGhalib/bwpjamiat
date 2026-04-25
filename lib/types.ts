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
