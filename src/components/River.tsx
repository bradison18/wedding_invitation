'use client';
import { useEffect, useRef } from 'react';
import { reduced } from '@/lib/client';
export type Form = 'river' | 'saree' | 'thread' | 'garland' | 'stars';
/* One unbroken line: each scene starts where the last ended, crosses in the empty top margin, then runs down the gutter. */
const strokes: Record<Form, [string, number, string?][]> = {
  river: [['#16294A', 7], ['#F4E8CF', 1.2], ['#B88A3B', 1, '14 10']],
  saree: [['#9E2B25', 9], ['#B88A3B', 5, '2 7'], ['#E0A11B', 1.5]],
  thread: [['#E0A11B', 6], ['#9E2B25', 6, '2 9']],
  garland: [['#2F5D3A', 2], ['#FBF5E6', 9, '.1 22'], ['#E0A11B', 9, '.1 11 .1 11']],
  stars: [['#B88A3B', 1.2], ['#F4E8CF', 5, '.1 46'], ['#E0A11B', 3, '.1 19']],
};
export function River({ form, from, to }: { form: Form; from: 'l' | 'r'; to: 'l' | 'r' }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current!, sec = svg.parentElement!;
    const draw = () => {
      const w = sec.clientWidth, h = sec.offsetHeight, g = w < 768 ? 9 : Math.min(48, w * 0.03);
      const X = { l: g, r: w - g }, a = X[from], z = X[to], amp = w < 768 ? 3 : 14;
      let d = `M${a} 0`, y = 0;
      if (from !== to) { d += ` C${a} 90 ${z} 20 ${z} 120`; y = 120; }
      const n = Math.max(2, Math.round((h - y) / 260)), st = (h - y) / n;
      for (let i = 0; i < n; i++) { const s = (i % 2 ? -1 : 1) * amp * (to === 'l' ? 1 : -1); d += ` C${z + s} ${y + st * 0.33} ${z + s} ${y + st * 0.66} ${z} ${y + st}`; y += st; }
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svg.querySelectorAll('path').forEach(p => p.setAttribute('d', d));
    };
    draw();
    const ro = new ResizeObserver(draw); ro.observe(sec);
    if (reduced()) return () => ro.disconnect();
    let on = false, raf = 0;
    const tick = () => { raf = 0; const b = sec.getBoundingClientRect(); svg.style.clipPath = `inset(0 0 ${Math.max(0, b.height - (innerHeight * 0.82 - b.top))}px 0)`; };
    const scr = () => { if (on && !raf) raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; tick(); }); io.observe(sec);
    addEventListener('scroll', scr, { passive: true });
    return () => { ro.disconnect(); io.disconnect(); removeEventListener('scroll', scr); cancelAnimationFrame(raf); };
  }, [from, to]);
  return <svg ref={ref} className="river" aria-hidden="true">{strokes[form].map(([c, w, dash], i) => <path key={i} fill="none" stroke={c} strokeWidth={w} strokeDasharray={dash} strokeLinecap="round" />)}</svg>;
}
