import Image from 'next/image';
import { wedding } from '@/config/wedding';
import embrace from '@/photos/embrace.jpg';
import { Scene3D } from './three/Scene3D';
import { Arches, C, Thoranam } from './art';
import { Greeting } from './Nav';

/** The cusped mandapam opening, drawn in a 400 x 560 box. */
const CUSP = 'M30 560V196A52 52 0 0 1 42 122A62 62 0 0 1 88 66A70 70 0 0 1 146 36Q184 32 200 10Q216 32 254 36A70 70 0 0 1 312 66A62 62 0 0 1 358 122A52 52 0 0 1 370 196V560Z';
const ring = (n: number) => Array.from({ length: n }, (_, i) => (i * 360) / n);

/** A lotus medallion that turns slowly behind the portrait like a rising sun. */
function Halo() {
  return (
    <svg className="halo" viewBox="-300 -300 600 600" aria-hidden="true">
      <circle r="214" fill="#F3BE5A" opacity=".5" />
      <g className="turn">{ring(32).map(a => <path key={a} transform={`rotate(${a})`} d="M0-212C22-236 16-266 0-284C-16-266-22-236 0-212Z" fill="#E0A11B" fillOpacity=".4" stroke={C.madder} strokeWidth="1.500" />)}
        {ring(64).map(a => <circle key={a} transform={`rotate(${a})`} cy="-292" r="2.200" fill={C.madder} />)}</g>
      <g className="turn back">{ring(24).map(a => <path key={a} transform={`rotate(${a})`} d="M0-168C26-180 24-204 0-216C-24-204-26-180 0-168Z" fill="#FBF5E6" fillOpacity=".6" stroke={C.zari} strokeWidth="1.500" />)}</g>
      <circle r="220" fill="none" stroke={C.madder} strokeWidth="2" /><circle r="226" fill="none" stroke={C.zari} strokeWidth="1.500" strokeDasharray="2 6" />
    </svg>
  );
}
/** Jasmine and marigold strings ending in a temple bell. */
function Strings() {
  return <>{[[4, 190], [11, 120], [89, 120], [96, 190]].map(([x, len], i) => (
    <svg key={x} className="string" style={{ left: `${x}%`, animationDelay: `${-i * 1.3}s` }} width="36" height={len + 44} viewBox={`-18 0 36 ${len + 44}`} aria-hidden="true">
      <path d={`M0 0V${len}`} stroke={C.leaf} strokeWidth="1.500" />
      {Array.from({ length: Math.floor(len / 13) }, (_, k) => <circle key={k} cy={8 + k * 13} r={k % 4 === 3 ? 8 : 5.5} fill={k % 4 === 3 ? C.turmeric : C.raw} stroke={k % 4 === 3 ? '#B5541C' : '#CDBB93'} strokeWidth="1.200" />)}
      <path d={`M0 ${len}C11 ${len} 9 ${len + 18} 15 ${len + 28}H-15C-9 ${len + 18}-11 ${len} 0 ${len}Z`} fill={C.zari} stroke={C.ink} strokeWidth="1.500" /><circle cy={len + 33} r="4.500" fill={C.madder} />
    </svg>))}</>;
}
export function Hero() {
  const { bride, groom, muhurtham, city, venue } = wedding;
  const [first, ...rest] = groom.name.en.split(' ');
  return (
    <section id="dawn" aria-label="Dawn" data-ground="#E9D6C6" className="hero">
      <Thoranam className="thoranam" />
      <Scene3D kind="river" label="" className="hero3d"><div className="land" aria-hidden="true">
        <svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <g data-depth="70"><path d="M0 262Q300 226 620 244T1100 214T1440 240V420H0Z" fill="#C9A491" /></g>
          <g data-depth="46"><path d="M0 284Q300 250 620 276T1440 262V420H0Z" fill="#EFE0CC" opacity=".75" /><g transform="translate(0 258)"><Arches n={30} w={48} h={44} fill="#A8533F" /></g><path d="M0 256H1440" stroke={C.ink} strokeWidth="3" /></g>
          <g data-depth="16"><path d="M0 302H1440V420H0Z" fill="#7F93A3" /></g>
        </svg>
      </div></Scene3D>
      <Strings />
      <div className="mandapam">
        <div className="m-top"><Greeting /><p className="invoke">Srirasthu · Subhamasthu · Avighnamasthu</p></div>
        <h1 className="sr-only">{groom.name.en} with {bride.name.en}</h1>
        <div className="m-name groom"><p className="big" aria-hidden="true"><span>{first}</span> <span>{rest.join(' ')}</span></p><p className="kin">Only son of {groom.parents.en}</p></div>
        <p className="m-with" aria-hidden="true"><span>with</span></p>
        <div className="m-name bride"><p className="big" aria-hidden="true"><span>{bride.name.en}</span></p><p className="kin">Daughter of {bride.parents.en}</p></div>
        <figure className="m-arch">
          <Halo />
          <svg width="0" height="0" className="absolute" aria-hidden="true"><clipPath id="cusp" clipPathUnits="objectBoundingBox"><path transform="scale(.0025 .00178571)" d={CUSP} /></clipPath></svg>
          <div className="m-photo"><Image src={embrace} alt={`${bride.name.en} and ${groom.name.en}, seated close together`} sizes="(max-width:768px) 78vw, 420px" preload fetchPriority="high" loading="eager" placeholder="blur" /></div>
          <svg className="m-frame" viewBox="0 0 400 560" aria-hidden="true">
            <g fill="none" strokeLinejoin="round"><path d={CUSP} stroke={C.ink} strokeWidth="27" /><path d={CUSP} stroke={C.madder} strokeWidth="23" /><path d={CUSP} stroke={C.turmeric} strokeWidth="12" /><path d={CUSP} stroke="#7E1F1A" strokeWidth="9" /><path d={CUSP} stroke="#F6D98A" strokeWidth="4.500" strokeDasharray=".1 11" strokeLinecap="round" /></g>
            <path d="M200-40C214-26 216-14 206-2H194C184-14 186-26 200-40Z" fill={C.turmeric} stroke={C.ink} strokeWidth="2" /><path d="M186-2H214L208 8H192Z" fill={C.madder} stroke={C.ink} strokeWidth="2" />
            <g stroke={C.ink} strokeWidth="2"><path d="M4 534H396V550H4Z" fill={C.turmeric} /><path d="M-14 550H414V566H-14Z" fill={C.madder} /><path d="M-32 566H432V584H-32Z" fill="#C98F6B" /></g>
            <path d="M10 558H394" stroke="#F6D98A" strokeWidth="4" strokeDasharray=".1 13" strokeLinecap="round" />
          </svg>
        </figure>
        <div className="m-info">
          <p className="m-date">{muhurtham.date.en}</p>
          <p>{venue.name.en}, {city.en}</p>
          <p className="m-cta"><a className="btn big" href="/rsvp">Join us</a><a className="quiet" href={venue.map} target="_blank" rel="noreferrer">Google Maps</a><a className="quiet" href="#events">Add to calendar</a></p>
        </div>
      </div>
    </section>
  );
}
