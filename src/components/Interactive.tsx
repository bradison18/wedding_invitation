'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { wedding, type Bi } from '@/config/wedding';
import { useL } from '@/lib/client';
import { Scene3D } from './three/Scene3D';
import { T } from './ui';
import garlands from '@/photos/garlands.jpg';
import standing from '@/photos/standing.jpg';
import embrace from '@/photos/embrace.jpg';
import rings from '@/photos/rings.jpg';
import corridor from '@/photos/corridor.jpg';
import seated from '@/photos/seated.jpg';
import family from '@/photos/family.jpg';
const b = (en: string): Bi => ({ en });

/* ---------- Countdown ---------- */
export function Countdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => { const f = () => setLeft(new Date(wedding.countdown.iso).getTime() - Date.now()); f(); const i = setInterval(f, 1000); return () => clearInterval(i); }, []);
  const m = Math.max(0, left ?? 0) / 60000;
  const parts = [[Math.floor(m / 1440), 'days'], [Math.floor(m / 60) % 24, 'hours'], [Math.floor(m) % 60, 'minutes'], [Math.floor(m * 60) % 60, 'seconds']] as const;
  return (
    <div className="countdown">
      <div>{left !== null && left <= 0 ? <p className="lede">The celebration has begun. Thank you for your blessings.</p>
        : <p className="ticks" role="timer">{parts.map(([n, l]) => <span key={l}><span className="num">{(left === null ? '––' : String(n).padStart(2, '0')).split('').map((c, k) => <i key={k}>{c}</i>)}</span><span className="block">{l}</span></span>)}</p>}
        <p className="mt-6 text-lg"><b><T b={wedding.countdown.label} /></b></p>
        <p className="mt-4"><b>Muhurtham:</b> <T b={wedding.muhurtham.date} />, <T b={wedding.muhurtham.time} />. <T b={wedding.muhurtham.panchangam} /></p>
      </div>
    </div>
  );
}

/* ---------- Two rings ---------- */
export function Rings() {
  return (
    <section id="rings" className="rings" aria-label="Two rings become one">
      <div className="rings-pin"><Scene3D kind="rings" track=".rings" className="fill" label="Two carved gold rings drift together while golden rice falls around them" action="Shower the couple with rice" />
        <p className="rings-cap">{wedding.groom.name.en} <small>with</small> {wedding.bride.name.en}</p></div>
    </section>
  );
}

/* ---------- Album ---------- */
const photos = [
  { src: garlands, cls: 'a', alt: b('The couple in jasmine and lotus garlands') },
  { src: rings, cls: 'b', alt: b('Gold ring resting in a hennaed palm') },
  { src: embrace, cls: 'c', alt: b('The couple seated close, looking the same way') },
  { src: corridor, cls: 'd', alt: b('The couple in a corridor, holding lotus buds') },
  { src: seated, cls: 'e', alt: b('The couple seated side by side in a hall') },
  { src: standing, cls: 'f', alt: b('The couple standing beneath hanging flowers') },
  { src: family, cls: 'g', alt: b('The couple seated on stage, surrounded by family') },
];
export function Album() {
  const L = useL(), dlg = useRef<HTMLDialogElement>(null), swipe = useRef<[number, number] | null>(null); const [i, setI] = useState(0);
  const mv = (n: number) => setI(v => (v + n + photos.length) % photos.length);
  return (
    <>
      <div className="album">{photos.map((p, n) => <button key={p.cls} className={`ph ${p.cls}`} onClick={() => { setI(n); dlg.current?.showModal(); }} aria-label={`${L(b('Enlarge'))}: ${L(p.alt)}`}><Image src={p.src} alt="" sizes={p.cls === 'g' ? '(max-width:768px) 100vw, 1200px' : '(max-width:768px) 92vw, 45vw'} quality={p.cls === 'g' ? 90 : undefined} placeholder="blur" /></button>)}</div>
      <dialog ref={dlg} className="lightbox" aria-label={L(b('Photos'))} onKeyDown={e => { if (e.key === 'ArrowRight') mv(1); if (e.key === 'ArrowLeft') mv(-1); }} onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
        onTouchStart={e => { swipe.current = e.touches.length === 1 ? [e.touches[0].clientX, e.touches[0].clientY] : null; }}
        onTouchEnd={e => { const s = swipe.current; swipe.current = null; if (!s) return; const x = e.changedTouches[0].clientX - s[0], y = e.changedTouches[0].clientY - s[1]; if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(y) * 1.4) mv(x < 0 ? 1 : -1); }}>
        <Image src={photos[i].src} alt={L(photos[i].alt)} sizes="92vw" />
        <div className="flex justify-between items-center gap-2"><button className="btn ghost dark" onClick={() => mv(-1)}><T b={b('Previous')} /></button><span aria-live="polite">{i + 1} / {photos.length}</span><button className="btn ghost dark" onClick={() => mv(1)}><T b={b('Next')} /></button><button className="btn ghost dark" onClick={() => dlg.current?.close()}><T b={b('Close')} /></button></div>
      </dialog>
    </>
  );
}
