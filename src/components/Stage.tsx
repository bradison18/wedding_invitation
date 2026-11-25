'use client';
import { useEffect } from 'react';
import { reduced } from '@/lib/client';
/* Page-wide light: the ground drifts through the day; scenes settle in; hero layers part. GSAP loads after first paint. */
export function Stage() {
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.rise,.unfold,.vow,.serve,.gate').forEach(e => io.observe(e));
    let off = () => {}, dead = false, started = false;
    const start = async () => {
      if (started) return; started = true;
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger);
      const secs = [...document.querySelectorAll<HTMLElement>('[data-ground]')];
      const ctx = gsap.context(() => {
        secs.forEach((s, i) => {
          if (!i || s.id === 'night') return; // night brings its own ground
          ScrollTrigger.create({ trigger: s, start: 'top 85%', end: 'top 25%', scrub: true,
            onUpdate: t => { document.body.style.backgroundColor = gsap.utils.interpolate(secs[i - 1].dataset.ground!, s.dataset.ground!, t.progress); } });
        });
        if (reduced()) return;
        gsap.utils.toArray<HTMLElement>('[data-depth]').forEach(l => gsap.to(l, { y: Number(l.dataset.depth), ease: 'none', scrollTrigger: { trigger: '#dawn', start: 'top top', end: 'bottom top', scrub: 0.6 } }));
        gsap.utils.toArray<HTMLElement>('[data-drift]').forEach(l => gsap.fromTo(l, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: l.parentElement, scrub: 0.6 } }));
      });
      const ro = new ResizeObserver(() => ScrollTrigger.refresh()); ro.observe(document.body);
      off = () => { ctx.revert(); ro.disconnect(); };
    };
    const timer = setTimeout(start, 4000);
    addEventListener('scroll', start, { once: true, passive: true });
    return () => { dead = true; clearTimeout(timer); removeEventListener('scroll', start); io.disconnect(); off(); };
  }, []);
  return null;
}
