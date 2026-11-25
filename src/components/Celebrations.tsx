import Image from 'next/image';
import { events } from '@/config/wedding';
import { gcal, sitePath, calendarDownload } from '@/lib/links';
import { C } from './art';

/* Three carved doorways. The doors swing open as each one scrolls into view. */
const OGEE = 'M0 420V158C0 62 112 54 160 0C208 54 320 62 320 158V420Z';
const Leaf = () => (
  <svg viewBox="0 0 160 420" preserveAspectRatio="none" aria-hidden="true"><rect width="160" height="420" fill="var(--tone)" /><path d="M0 0H160V420H0Z" fill="none" stroke="#0004" strokeWidth="5" />
    <g fill="#0002" stroke={C.zari} strokeWidth="3">{[96, 206, 316].map(y => <path key={y} d={`M18 ${y}H142V${y + 88}H18Z`} />)}</g>
    <g fill="none" stroke="#E9B949" strokeWidth="2">{[140, 250, 360].map(y => <g key={y} transform={`translate(80 ${y})`}>{[0, 45, 90, 135, 180, 225, 270, 315].map(a => <path key={a} transform={`rotate(${a})`} d="M0-6C10-16 8-26 0-34C-8-26-10-16 0-6Z" />)}<circle r="4" fill="#E9B949" /></g>)}</g>
    <circle cx="150" cy="240" r="6" fill="#E9B949" /></svg>
);
export function Celebrations() {
  return (
    <div className="gates">
      <svg width="0" height="0" className="absolute" aria-hidden="true"><clipPath id="ogee" clipPathUnits="objectBoundingBox"><path transform="scale(.003125 .00238095)" d={OGEE} /></clipPath></svg>
      {events.map((e, i) => {
        return (
          <article key={e.id} suppressHydrationWarning className={`gate g-${e.id}`} style={{ '--tone': e.tone, '--d': `${i * 0.25}s` } as React.CSSProperties}>
            <div className="gate-arch" aria-hidden="true">
              <div className="gate-in">
                <Image className="gate-scene" src={sitePath(`/doorways/${e.id}.webp`)} alt="" fill sizes="(min-width: 1000px) min(28vw, 380px), (max-width: 420px) 90vw, 380px" />
                <span className="door l"><Leaf /></span><span className="door r"><Leaf /></span>
              </div>
              <svg className="gate-frame" viewBox="0 0 320 420"><g fill="none"><path d={OGEE} stroke={C.ink} strokeWidth="18" /><path d={OGEE} stroke="var(--tone)" strokeWidth="15" /><path d={OGEE} stroke="#F6D98A" strokeWidth="4" strokeDasharray=".1 10" strokeLinecap="round" /></g><path d="M160-38C172-26 174-16 166-4H154C146-16 148-26 160-38Z" fill={C.turmeric} stroke={C.ink} strokeWidth="2" /><path d="M-14 412H334V432H-14Z" fill={C.turmeric} stroke={C.ink} strokeWidth="2" /></svg>
            </div>
            <div className="gate-text">
              <h3>{e.name.en}</h3>
              <p className="gate-date">{e.date.en}</p>{e.time.en && <p>{e.time.en}</p>}
              <p className="gate-venue">{e.venue.en}</p>
              <p className="gate-links"><a className="btn" href={e.map} target="_blank" rel="noreferrer" aria-label={`Google Maps: ${e.name.en}`}>Google Maps</a><a className="btn ghost" href={gcal(e)} target="_blank" rel="noreferrer" aria-label={`Google Calendar: ${e.name.en}`}>Google Calendar</a><a className="quiet" href={calendarDownload(e)} download={`${e.id}.ics`} aria-label={`Apple / other calendar: ${e.name.en}`}>Apple / other</a></p>
            </div>
          </article>);
      })}
    </div>
  );
}
