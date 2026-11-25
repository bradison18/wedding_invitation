'use client';
import { useEffect, useRef, useState } from 'react';
import { T } from './ui';
export function Nav() {
  const lamp = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const f = () => { raf ||= requestAnimationFrame(() => { raf = 0; const p = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight); if (lamp.current) lamp.current.style.transform = `translateX(${p * (innerWidth - 28)}px)`; }); };
    f(); addEventListener('scroll', f, { passive: true }); addEventListener('resize', f);
    return () => { removeEventListener('scroll', f); removeEventListener('resize', f); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div className="nav" aria-hidden="true">
        <span className="thread" aria-hidden="true"><span ref={lamp} className="lampdot"><svg viewBox="0 0 28 30"><path d="M14 2Q20 12 14 17Q8 12 14 2Z" fill="#E0A11B" stroke="#9E2B25" /><path d="M3 17Q14 24 25 17Q22 28 14 28Q6 28 3 17Z" fill="#B88A3B" stroke="#221A16" /></svg></span></span>
      </div>
    </>
  );
}
export function Greeting() {
  const [g, setG] = useState('');
  useEffect(() => { setG((new URLSearchParams(location.search).get('guest') ?? '').replace(/[^\p{L}\p{M}\p{N} .&'‌‍-]/gu, '').trim().slice(0, 40)); }, []);
  return g ? <p className="greet"><T b={{ en: `Dear ${g}, you are warmly invited` }} /></p> : null;
}
