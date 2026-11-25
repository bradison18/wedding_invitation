'use client';
import { wedding } from '@/config/wedding';
/* Original synthesis, so nothing needs licensing. Drop licensed files into config.audio to replace it. */
let ctx: AudioContext | null = null, master: GainNode, file: HTMLAudioElement | null = null, on = false;
const subs = new Set<() => void>();
export const soundSub = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
export const soundOn = () => on;
function noise(c: AudioContext, sec: number) { const b = c.createBuffer(1, c.sampleRate * sec, c.sampleRate), d = b.getChannelData(0); let l = 0; for (let i = 0; i < d.length; i++) { l = l * 0.97 + (Math.random() * 2 - 1) * 0.03; d[i] = l * 6; } return b; }
export function toggleSound(v = !on) {
  on = v;
  if (v && !ctx) {
    ctx = new AudioContext(); master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    if (wedding.audio.ambience) { file = new Audio(wedding.audio.ambience); file.loop = true; ctx.createMediaElementSource(file).connect(master); }
    else {
      const s = ctx.createBufferSource(); s.buffer = noise(ctx, 6); s.loop = true;
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 700;
      const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.12; lg.gain.value = 260; lfo.connect(lg).connect(f.frequency); lfo.start();
      s.connect(f).connect(master); s.start();
      [130.8, 196].forEach(h => { const o = ctx!.createOscillator(), g = ctx!.createGain(); o.frequency.value = h; g.gain.value = 0.05; o.connect(g).connect(master); o.start(); });
    }
  }
  if (ctx) { void ctx.resume(); if (v) void file?.play(); master.gain.setTargetAtTime(v ? 0.22 : 0, ctx.currentTime, 0.6); if (!v) setTimeout(() => !on && file?.pause(), 2500); }
  subs.forEach(f => f());
}
export function gattimelam() {
  if (!on || !ctx) return;
  if (wedding.audio.gattimelam) { void new Audio(wedding.audio.gattimelam).play(); return; }
  for (let i = 0; i < 26; i++) {
    const t = ctx.currentTime + i * 0.13 - i * i * 0.0012, o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(i % 3 ? 190 : 105, t); o.frequency.exponentialRampToValueAtTime(60, t + 0.12);
    g.gain.setValueAtTime(0.15 + i * 0.015, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    o.connect(g).connect(master); o.start(t); o.stop(t + 0.2);
  }
}
