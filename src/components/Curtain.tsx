'use client';
import { useEffect, useRef, useState } from 'react';
import { reduced } from '@/lib/client';
import { Toy } from './art';
import { T } from './ui';

const VS = `attribute vec2 a;uniform float d,t,h;varying vec2 u;varying float s,k;
void main(){u=a*.5+.5;float top=u.y;float amp=.5+h*.4+d*1.2;
float ph=a.x*19.+sin(a.y*1.7+t*.5)*(.5+d)+sin(a.x*5.)*.8;
s=cos(ph)*amp;k=h;
float fall=d*d*2.9*(1.-.16*a.x*a.x+.07*sin(a.x*7.));
float y=a.y*1.06-fall-h*.1*top*(1.-a.x*a.x);
y=mix(y,max(y,-1.5+.06*sin(ph)),d);
gl_Position=vec4(a.x*1.06+sin(ph)*.006*amp+d*.05*sin(a.y*3.+t),y,0.,1.);}`;
const FS = `precision mediump float;varying vec2 u;varying float s,k;uniform vec2 r;
void main(){vec2 p=u*r;vec3 c=vec3(1.,.955,.86);
c-=.022*(step(.5,fract(p.x/3.))+step(.5,fract(p.y/3.)))*.6;
vec2 g=abs(fract(p/44.)-.5);c=mix(c,vec3(.88,.63,.11),.16*step(.47,max(g.x,g.y)));
float e=p.y;if(e<96.){c=vec3(.86,.61,.1);c=mix(c,vec3(.62,.17,.145),step(60.,e)*step(e,72.));
float z=abs(fract(p.x/36.)-.5)*36.;c=mix(c,vec3(.62,.17,.145),step(abs(e-30.)+z,14.));}
if(e>r.y-34.)c=vec3(.86,.61,.1);
c*=.94+.07*s;gl_FragColor=vec4(c,1.)*.94;}`;

export function Curtain() {
  const [gone, setGone] = useState(false);
  const [gl, setGl] = useState(true);
  const root = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null);
  const st = useRef({ drop: -1, done: false });

  function leave() {
    if (st.current.drop >= 0 || st.current.done) return;

    if (reduced()) { st.current.done = true; root.current?.classList.add('fading'); setTimeout(() => setGone(true), 300); return; }
    st.current.drop = 0; root.current?.classList.add('dropping');
  }
  const leaveRef = useRef(leave); leaveRef.current = leave;

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.entered) { setGone(true); return; }
    const main = document.getElementById('page'); main?.setAttribute('inert', ''); html.style.overflow = 'hidden';
    root.current?.focus();
    const c = cv.current!, g = c.getContext('webgl', { premultipliedAlpha: true, antialias: true });
    let draw: ((t: number) => void) | null = null;
    if (g && !reduced()) {
      const mk = (type: number, src: string) => { const s = g.createShader(type)!; g.shaderSource(s, src); g.compileShader(s); return s; };
      const p = g.createProgram()!; g.attachShader(p, mk(g.VERTEX_SHADER, VS)); g.attachShader(p, mk(g.FRAGMENT_SHADER, FS)); g.linkProgram(p);
      if (g.getProgramParameter(p, g.LINK_STATUS)) {
        g.useProgram(p); const v: number[] = [], NX = 72, NY = 18;
        for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) for (const [i, j] of [[0, 0], [1, 0], [0, 1], [0, 1], [1, 0], [1, 1]]) v.push((x + i) / NX * 2 - 1, (y + j) / NY * 2 - 1);
        g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer()); g.bufferData(g.ARRAY_BUFFER, new Float32Array(v), g.STATIC_DRAW);
        const a = g.getAttribLocation(p, 'a'); g.enableVertexAttribArray(a); g.vertexAttribPointer(a, 2, g.FLOAT, false, 0, 0);
        const u = (n: string) => g.getUniformLocation(p, n), ud = u('d'), ut = u('t'), uh = u('h'), ur = u('r');
        draw = t => {
          const dpr = Math.min(devicePixelRatio, 1.25), w = innerWidth * dpr | 0, h = innerHeight * dpr | 0;
          if (c.width !== w || c.height !== h) { c.width = w; c.height = h; g.viewport(0, 0, w, h); }
          g.uniform1f(ud, Math.max(0, st.current.drop)); g.uniform1f(ut, t / 1000); g.uniform1f(uh, 0); g.uniform2f(ur, innerWidth, innerHeight);
          g.clear(g.COLOR_BUFFER_BIT); g.drawArrays(g.TRIANGLES, 0, v.length / 2);
        };
      }
    }
    if (!draw) setGl(false);
    let raf = 0, last = performance.now(), drawn = -999;
    const loop = (t: number) => {
      const dt = Math.max(0, Math.min(0.05, (t - last) / 1000)), s = st.current; last = t;
      if (s.drop >= 0) { s.drop += dt / 1.4; if (s.drop >= 1.05) { setGone(true); return; } }
      // At rest the cloth only breathes, so a few frames a second are enough.
      if (s.drop >= 0 || t - drawn > 120) { drawn = t; draw?.(t); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') leaveRef.current(); };
    addEventListener('keydown', key);
    return () => { cancelAnimationFrame(raf); removeEventListener('keydown', key); main?.removeAttribute('inert'); html.style.overflow = ''; };
  }, []);
  useEffect(() => { if (gone) { document.getElementById('page')?.removeAttribute('inert'); document.documentElement.style.overflow = ''; document.documentElement.dataset.entered = '1'; } }, [gone]);
  if (gone) return null;
  return (
    <div ref={root} className={`curtain ${gl ? '' : 'no-gl'}`} role="dialog" aria-modal="true" aria-label="Welcome curtain" tabIndex={-1} onClick={leave}>
      <div className="behind" aria-hidden="true" />
      <canvas ref={cv} aria-hidden="true" />
      <svg className="shadows" viewBox="0 0 400 260" aria-hidden="true"><g filter="url(#sil)"><Toy x={110} y={250} kind="groom" s={1.2} /><Toy x={290} y={250} kind="bride" s={1.2} flip /></g><filter id="sil"><feColorMatrix values="0 0 0 0 .38 0 0 0 0 .18 0 0 0 0 .08 0 0 0 .34 0" /><feGaussianBlur stdDeviation="4" /></filter></svg>
      <div className="curtain-copy">
        <p className="bless">Srirasthu · Subhamasthu · Avighnamasthu</p>
        <button className="hold" onClick={leave}>
          <span className="leafring"><svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 8C100 30 108 74 60 112C12 74 20 30 60 8Z" fill="#2F5D3A" stroke="#221A16" strokeWidth="2.500" /><path d="M60 16V106M60 40Q80 44 92 58M60 40Q40 44 28 58M60 66Q76 70 86 82M60 66Q44 70 34 82" stroke="#8DB36B" strokeWidth="2" fill="none" /><path d="M42 66Q44 48 60 50Q78 48 78 66Q70 78 60 77Q48 78 42 66Z" fill="#6B3A1E" stroke="#221A16" strokeWidth="2" /><g fill="#E0A11B">{[[52, 60], [62, 57], [69, 66], [57, 69], [64, 72]].map(([x, y]) => <ellipse key={x} cx={x} cy={y} rx="3" ry="1.500" />)}</g></svg></span>
          <span><T b={{ en: 'Touch or click to open' }} /></span>
        </button>
      </div>
    </div>
  );
}
