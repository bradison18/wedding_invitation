'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { reduced } from '@/lib/client';
import type { Ctl, Kind } from './scenes';

/** Loads Three.js only when the scene is near, draws only while visible, and keeps the 2D fallback if WebGL is missing. */
export function Scene3D({ kind, label, className = '', track, action, children }: { kind: Kind; label: string; className?: string; track?: string; action?: string; children?: ReactNode }) {
  const box = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null), ctl = useRef<Ctl | null>(null), kick = useRef(() => {});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = box.current!, still = reduced();
    let raf = 0, on = false, dead = false, loading = false, last = 0, px = 0, py = 0, tx = 0, ty = 0, t = 0;
    const host = () => (track ? (el.closest(track) as HTMLElement) : el) ?? el;
    const prog = () => { const r = host().getBoundingClientRect(); return track ? Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight))) : Math.max(0, Math.min(1, -r.top / r.height)); };
    const size = () => { if (el.clientWidth) ctl.current?.resize(el.clientWidth, el.clientHeight); if (still) ctl.current?.frame(20, 8, track ? 0.8 : 0, 0, 0); };
    const loop = (now: number) => { raf = 0; if (!on || !ctl.current) return; const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = now; t += dt; px += (tx - px) * 0.04; py += (ty - py) * 0.04; ctl.current.frame(t, dt, prog(), px, py); raf = requestAnimationFrame(loop); };
    const go = () => { if (on && !raf && !still && ctl.current && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    kick.current = () => { if (still) ctl.current?.frame(20, 1.2, track ? 0.8 : 0, 0, 0); };
    const load = async () => {
      if (loading) return; loading = true;
      try { const { build } = await import('./scenes'); if (dead) return; ctl.current = build(kind, cv.current!); size(); if (!still) ctl.current.frame(0, 0.01, prog(), 0, 0); setReady(true); go(); } catch { /* the fallback stays */ }
    };
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { near.disconnect(); if (kind === 'river') setTimeout(load, 600); else void load(); } }, { rootMargin: '500px 0px' }); near.observe(el);
    const vis = new IntersectionObserver(([e]) => { on = e.isIntersecting; go(); }); vis.observe(el);
    const ro = new ResizeObserver(size); ro.observe(el);
    const mv = (e: PointerEvent) => { tx = (e.clientX / innerWidth) * 2 - 1; ty = (e.clientY / innerHeight) * 2 - 1; };
    const bless = () => ctl.current?.add();
    addEventListener('pointermove', mv, { passive: true }); document.addEventListener('visibilitychange', go); if (kind === 'night') addEventListener('kt-blessing', bless);
    return () => { dead = true; cancelAnimationFrame(raf); near.disconnect(); vis.disconnect(); ro.disconnect(); removeEventListener('pointermove', mv); document.removeEventListener('visibilitychange', go); removeEventListener('kt-blessing', bless); ctl.current?.dispose(); ctl.current = null; };
  }, [kind, track]);
  const act = () => { ctl.current?.tap(); kick.current(); };
  return (
    <>
      <div ref={box} className={`s3d ${ready ? 'ready' : ''} ${className}`}>
        {children && <div className="s3d-fallback">{children}</div>}
        <canvas ref={cv} role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true} onClick={action ? act : undefined} />
      </div>
      {action && <button className="btn gold s3d-btn" onClick={act}>{action}</button>}
    </>
  );
}
