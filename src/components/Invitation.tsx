import Image from 'next/image';
import { events, wedding as w } from '@/config/wedding';
import { gcal } from '@/lib/links';
import garlands from '@/photos/garlands.jpg';
import { C, Kalasham, Lamp } from './art';

const petals = [0, 45, 90, 135, 180, 225, 270, 315];
const Bloom = ({ x, y, s, f }: { x: number; y: number; s: number; f: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>{petals.map(a => <path key={a} transform={`rotate(${a})`} d="M0-3C9-9 8-20 0-26C-8-20-9-9 0-3Z" fill={f} stroke={C.ink} strokeWidth="1.200" />)}<circle r="6" fill={C.turmeric} stroke={C.ink} strokeWidth="1.200" /></g>
);
/** Points round an oval, rounded so server and browser agree. */
const oval = (n: number, rx: number, ry: number) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return [Math.round(Math.cos(a) * rx), Math.round(Math.sin(a) * ry)]; });

/** The varamala: jasmine and lotus wound round the portrait, 400 x 520. */
const Varamala = () => (
  <svg className="inv-mala" viewBox="-200 -260 400 520" aria-hidden="true">
    <ellipse rx="176" ry="236" fill="none" stroke={C.zari} strokeWidth="3" /><ellipse rx="184" ry="244" fill="none" stroke={C.leaf} strokeWidth="16" />
    {oval(92, 184, 244).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 2 ? 8.5 : 7} fill={C.raw} stroke="#CDBB93" />)}
    {oval(12, 184, 244).map(([x, y], i) => <Bloom key={i} x={x} y={y} s={i % 3 ? 0.62 : 0.95} f={i % 3 ? '#F0B7C8' : '#E27D9E'} />)}
  </svg>
);
/** A row of lotus buds and vine that divides the sheet. */
const Divider = () => (
  <svg className="inv-div" viewBox="-300 -30 600 60" aria-hidden="true"><path d="M-290 0Q-240-26-190 0T-90 0H-40M290 0Q240 26 190 0T90 0H40" fill="none" stroke={C.leaf} strokeWidth="2.500" />
    {[-240, -140, 140, 240].map((x, i) => <path key={x} transform={`translate(${x} ${i % 2 ? 4 : -4}) rotate(${i % 2 ? 150 : 30})`} d="M0 0Q-9-14 0-28Q9-14 0 0Z" fill={C.leaf} />)}
    <Bloom x={-190} y={0} s={0.5} f="#E27D9E" /><Bloom x={190} y={0} s={0.5} f="#E27D9E" /><Bloom x={0} y={0} s={1} f={C.madder} /></svg>
);
const Person = ({ p, role, side }: { p: typeof w.bride; role: string; side: string }) => (
  <div className={`inv-person ${side}`}><h3>{p.formal.en}</h3><p>{p.grand.en}</p><p>{role} <b>{p.parents.en}</b></p></div>
);
export function Invitation() {
  const m = w.muhurtham;
  return (
    <div className="unfold scroll" suppressHydrationWarning>
      <span className="roller" aria-hidden="true"><i /><i /></span>
      <div className="sheet"><div className="sheet-in">
        <svg className="inv-crest" viewBox="-150 -120 300 130" aria-hidden="true"><Lamp x={-96} y={0} s={0.95} /><Kalasham x={0} y={0} s={1.2} /><Lamp x={96} y={0} s={0.95} /></svg>
        <p className="inv-invoke">Srirasthu · Subhamasthu · Avighnamasthu</p>
        <h2 className="inv-title">Wedding Invitation</h2>
        <Divider />
        <p className="inv-lede"><b>{w.groom.parents.en}</b> cordially solicit your gracious presence with family on the auspicious occasion of the marriage of our only son</p>
        <div className="inv-couple">
          <Person p={w.groom} role="Only son of" side="groom" />
          <p className="inv-with">with</p>
          <Person p={w.bride} role="Daughter of" side="bride" />
          <figure className="inv-photo"><div><Image src={garlands} alt={`${w.groom.name.en} and ${w.bride.name.en} in jasmine and lotus garlands`} sizes="(max-width:1000px) 80vw, 420px" placeholder="blur" /></div><Varamala /></figure>
        </div>
        <Divider />
        <dl className="inv-tags">
          <div><dt>Muhurtham</dt><dd><b>{m.date.en}</b><br /><span className="inv-time">{m.time.en}</span>{m.panchangam.en}</dd></div>
          <div><dt>Venue</dt><dd><b>{w.venue.name.en}</b><br />{w.venue.address.en}</dd></div>
          <div><dt>Dinner</dt><dd><b>{events[0].date.en}</b><br />{events[0].time.en}</dd></div>
        </dl>
        <p className="inv-cta"><a className="btn" href={w.venue.map} target="_blank" rel="noreferrer">Google Maps</a><a className="btn ghost" href={gcal(events[1])} target="_blank" rel="noreferrer">Add to calendar</a></p>
        <p className="inv-sign">Yours,<br /><b>{w.contacts[0].name.en}</b></p><p>With best compliments from near and dear</p>
      </div></div>
      <span className="roller low" aria-hidden="true"><i /><i /></span>
    </div>
  );
}
