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

export function getEventState(event: Pick<EventRecord, 'startsAt' | 'dateStr'>) {
  const startTime = getEventStartTime(event);

  if (startTime == null) {
    return 'unknown';
  }

  return startTime >= Date.now() ? 'upcoming' : 'past';
}

export function sortEventsBySchedule(events: EventRecord[]) {
  const upcoming: EventRecord[] = [];
  const past: EventRecord[] = [];
  const unknown: EventRecord[] = [];

  for (const event of events) {
    const startTime = getEventStartTime(event);

    if (startTime == null) {
      unknown.push(event);
      continue;
    }

    if (startTime >= Date.now()) {
      upcoming.push(event);
    } else {
      past.push(event);
    }
  }

  upcoming.sort((left, right) => (getEventStartTime(left) ?? 0) - (getEventStartTime(right) ?? 0));
  past.sort((left, right) => (getEventStartTime(right) ?? 0) - (getEventStartTime(left) ?? 0));
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