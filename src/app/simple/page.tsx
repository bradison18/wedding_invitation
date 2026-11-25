import type { Metadata } from 'next';
import { gcal, sitePath, calendarDownload } from '@/lib/links';
import { events, wedding as w } from '@/config/wedding';
export const metadata: Metadata = { title: 'Simple view' };
export default function Simple() {
  return <main className="simple"><p><a href={sitePath('/')}>← Full site</a></p><h1>{w.groom.name.en} &amp; {w.bride.name.en}</h1>
    <p>Muhurtham: {w.muhurtham.date.en}, {w.muhurtham.time.en}<br />{w.muhurtham.panchangam.en}</p><p>{w.venue.name.en}<br />{w.venue.address.en}<br /><a href={w.venue.map}>Google Maps</a></p>
    <h2>Events</h2>{events.map(e => <div key={e.id}><h3>{e.name.en}</h3><p>{e.date.en}{e.time.en && `, ${e.time.en}`}<br />{e.venue.en}<br /><a href={e.map}>Google Maps</a> · <a href={gcal(e)}>Google Calendar</a> · <a href={calendarDownload(e)} download={`${e.id}.ics`}>Other calendar</a></p></div>)}
    <h2>Contacts</h2>{w.contacts.map(c => <p key={c.who.en}>{c.who.en}: {c.name.en} {c.phone}</p>)}</main>;
}
