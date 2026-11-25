'use client';
import { useEffect, useRef, useState } from 'react';
import { useL } from '@/lib/client';
import { wedding } from '@/config/wedding';
import { waLink } from '@/lib/links';
import { T } from './ui';
const links = [['dawn', 'Home'], ['shubhalekha', 'Invitation'], ['rings', 'Two rings'], ['muggu', 'Countdown'], ['events', 'Events'], ['album', 'Album'], ['night', 'RSVP']];
export function Nav() {
  const dlg = useRef<HTMLDialogElement>(null), lamp = useRef<HTMLSpanElement>(null);
  const L = useL();
  const [share, setShare] = useState('');
  useEffect(() => {
    setShare(waLink(`${wedding.groom.name.en} & ${wedding.bride.name.en}\n${wedding.muhurtham.date.en}, ${wedding.city.en}\n${location.origin}\nMap: ${wedding.venue.map}`, ''));
    let raf = 0;
    const f = () => { raf ||= requestAnimationFrame(() => { raf = 0; const p = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight); if (lamp.current) lamp.current.style.transform = `translateX(${p * (innerWidth - 28)}px)`; }); };
    f(); addEventListener('scroll', f, { passive: true }); addEventListener('resize', f);
    return () => { removeEventListener('scroll', f); removeEventListener('resize', f); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <nav className="nav" aria-label="Main">
        <button className="navbtn" onClick={() => dlg.current?.showModal()} aria-haspopup="dialog"><svg width="20" height="14" aria-hidden="true"><path d="M0 2Q5-1 10 2T20 2M0 7Q5 4 10 7T20 7M0 12Q5 9 10 12T20 12" stroke="currentColor" strokeWidth="1.800" fill="none" /></svg><T b={{ en: 'Menu' }} /></button>
        <span className="flex items-center">
          <a className="btn small" href="/rsvp"><T b={{ en: 'RSVP' }} /></a>
        </span>
        <span className="thread" aria-hidden="true"><span ref={lamp} className="lampdot"><svg viewBox="0 0 28 30"><path d="M14 2Q20 12 14 17Q8 12 14 2Z" fill="#E0A11B" stroke="#9E2B25" /><path d="M3 17Q14 24 25 17Q22 28 14 28Q6 28 3 17Z" fill="#B88A3B" stroke="#221A16" /></svg></span></span>
      </nav>
      <dialog ref={dlg} className="menu" aria-label={L({ en: 'Menu' })} onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
        <button className="navbtn ml-auto" onClick={() => dlg.current?.close()}><T b={{ en: 'Close' }} /> ✕</button>
        <ul>{links.map(([id, en]) => <li key={id}><a href={`#${id}`} onClick={() => dlg.current?.close()}>{en}</a></li>)}</ul>
        <div className="flex flex-wrap gap-3 mt-4"><a className="btn ghost" href="/simple"><T b={{ en: 'Simple view' }} /></a><a className="btn ghost" href={share} target="_blank" rel="noreferrer"><T b={{ en: 'Share on WhatsApp' }} /></a></div>
      </dialog>
    </>
  );
}
export function Greeting() {
  const [g, setG] = useState('');
  useEffect(() => { setG((new URLSearchParams(location.search).get('guest') ?? '').replace(/[^\p{L}\p{M}\p{N} .&'‌‍-]/gu, '').trim().slice(0, 40)); }, []);
  return g ? <p className="greet"><T b={{ en: `Dear ${g}, you are warmly invited` }} /></p> : null;
}
