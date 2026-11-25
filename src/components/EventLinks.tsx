'use client';

import { useEffect, useState } from 'react';
import type { EventItem } from '@/config/wedding';
import { gcal, sitePath } from '@/lib/links';

export function EventLinks({ event }: { event: EventItem }) {
  const [android, setAndroid] = useState(false);
  useEffect(() => setAndroid(/Android/i.test(navigator.userAgent)), []);

  if (event.id !== 'pelli' && event.id !== 'reception') return null;
  const href = android ? gcal(event) : sitePath(`/calendar/${event.id}.ics`);
  return (
    <p className="gate-links">
      <a className="btn" href={event.map} target="_blank" rel="noreferrer" aria-label={`Google Maps: ${event.name.en}`}>Google Maps</a>
      <a className="btn ghost" href={href} aria-label={`Add to calendar: ${event.name.en}`}>Add to calendar</a>
    </p>
  );
}
