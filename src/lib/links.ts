import { wedding, type EventItem } from '@/config/wedding';
export const waLink = (text: string, to = wedding.whatsapp) => `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
const z = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');
const day = (s: string) => s.replace(/-/g, '');
const stamp = (s: string) => (s.length === 10 ? `;VALUE=DATE:${day(s)}` : `:${z(s)}`);
const esc = (s: string) => s.replace(/([\;,])/g, '\\$1').replace(/\n/g, '\\n');
export function ics(list: EventItem[]) {
  const title = `${wedding.groom.name.en} & ${wedding.bride.name.en}`;
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Krishna Theeram//Wedding//EN',
    ...list.flatMap(e => ['BEGIN:VEVENT', `UID:${e.id}@krishna-theeram`, 'DTSTAMP:20261101T000000Z', `DTSTART${stamp(e.start)}`, `DTEND${stamp(e.end)}`,
      `SUMMARY:${esc(`${e.name.en}: ${title}`)}`, `LOCATION:${esc(`${e.venue.en}`)}`, 'END:VEVENT']),
    'END:VCALENDAR', ''].join('\r\n');
}
export function gcal(e: EventItem) {
  const f = (s: string) => (s.length === 10 ? day(s) : z(s));
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: 'TEMPLATE', text: `${e.name.en}: ${wedding.groom.name.en} & ${wedding.bride.name.en}`, dates: `${f(e.start)}/${f(e.end)}`, location: e.venue.en, details: `Map: ${e.map}`, ctz: 'Asia/Kolkata' })}`;
}
