export interface EventRecord {
  id: string;
  title?: string;
  dateStr?: string;
  startsAt?: string;
  location?: string;
  imageUrl?: string;
  imageStoragePath?: string;
  isActive?: boolean;
  duration?: string;
  registrationLink?: string;
  description?: string;
  eventTheme?: EventThemeConfig;
  eventCategory?: 'standard' | 'dedicated';
  dedicatedPath?: string;
  pageRef?: string;
}

export interface EventThemeMeshPoint {
  x: number;
  y: number;
  radius: number;
}

export interface EventThemeMesh {
  highlight: EventThemeMeshPoint;
  glow: EventThemeMeshPoint;
  angle: number;
}

export interface EventThemeConfig {
  version: number;
  gradient: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  heading: string;
  textOnAccent: string;
  isDark: boolean;
  mesh: EventThemeMesh;
  generatedAt: string;
  source: 'image' | 'fallback';
}

function parseDateCandidate(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function getEventStartTime(event: Pick<EventRecord, 'startsAt' | 'dateStr'>) {
  return parseDateCandidate(event.startsAt) ?? parseDateCandidate(event.dateStr);
}

export function getEventState(event: Pick<EventRecord, 'startsAt' | 'dateStr'>, now?: Date) {
  const startTime = getEventStartTime(event);

  if (startTime == null) {
    return 'unknown';
  }

  if (!now) {
    now = new Date();
  }

  const startDate = new Date(startTime);

  if (
    startDate.getFullYear() === now.getFullYear()
    && startDate.getMonth() === now.getMonth()
    && startDate.getDate() === now.getDate()
  ) {
    return 'ongoing';
  }

  return startTime > now.getTime() ? 'upcoming' : 'past';
}

export function sortEventsBySchedule(events: EventRecord[]) {
  const upcoming: EventRecord[] = [];
  const past: EventRecord[] = [];
  const unknown: EventRecord[] = [];

  const now = new Date();
  const nowTime = now.getTime();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();
  const nowDate = now.getDate();

  const startTimes = new Map<EventRecord, number>();

  for (const event of events) {
    const startTime = getEventStartTime(event);

    if (startTime == null) {
      unknown.push(event);
      continue;
    }

    startTimes.set(event, startTime);

    const startDate = new Date(startTime);
    const isSameDay =
      startDate.getFullYear() === nowYear
      && startDate.getMonth() === nowMonth
      && startDate.getDate() === nowDate;

    if (isSameDay) {
      upcoming.push(event);
    } else if (startTime > nowTime) {
      upcoming.push(event);
    } else {
      past.push(event);
    }
  }

  upcoming.sort((left, right) => (startTimes.get(left) ?? 0) - (startTimes.get(right) ?? 0));
  past.sort((left, right) => (startTimes.get(right) ?? 0) - (startTimes.get(left) ?? 0));
  unknown.sort((left, right) => (left.title || '').localeCompare(right.title || ''));

  return [...upcoming, ...past, ...unknown];
}

export function toDateTimeLocalValue(value?: string) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

export function fromDateTimeLocalValue(value: string) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}
