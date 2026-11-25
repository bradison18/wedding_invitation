'use client';
import { useEffect, useRef, useState } from 'react';
import { events, type Bi } from '@/config/wedding';
import { useL } from '@/lib/client';
import { waLink } from '@/lib/links';
import { T } from './ui';
const b = (en: string): Bi => ({ en });
const onPages = Boolean(process.env.NEXT_PUBLIC_BASE_PATH);
const errs: Record<string, Bi> = {
  invalid: b('Please check your name, phone number and guest count.'),
  slow: b('Too many attempts. Please wait a few minutes.'),
  unconfigured: b('RSVP storage is not configured yet, so nothing was saved. Please reply on WhatsApp.'),
  failed: b('We could not save your reply. Try again, or use WhatsApp.'),
};
export function RsvpForm({ initial }: { initial?: string }) {
  const L = useL();
  const form = useRef<HTMLFormElement>(null), box = useRef<HTMLDivElement>(null);
  const [js, setJs] = useState(false), [step, setStep] = useState(0), [busy, setBusy] = useState(false);
  const [err, setErr] = useState<Bi | null>(initial && initial !== 'ok' ? errs[initial] ?? errs.failed : null);
  const [done, setDone] = useState(initial === 'ok'), [bless, setBless] = useState('');
  useEffect(() => setJs(true), []);
  const last = 3;
  function go(n: number) {
    if (n > step) {
      const bad = box.current?.querySelector<HTMLInputElement>(`[data-step="${step}"] :invalid`);
      if (bad) { setErr(bad.name === 'phone' ? b('Please enter a phone number with at least 8 digits.') : bad.name === 'guests' ? b('Between 1 and 20 guests, please.') : b('Please tell us your name.')); bad.focus(); return; }
    }
    setErr(null); setStep(n);
    requestAnimationFrame(() => box.current?.querySelector<HTMLElement>(`[data-step="${n}"] legend`)?.focus());
  }
  const data = () => { const f = new FormData(form.current!); return { ...Object.fromEntries(f), events: f.getAll('events') } as Record<string, string | string[]>; };
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (step < last) return go(step + 1);
    if (onPages) return whatsapp();
    setBusy(true); setErr(null);
    try {
      const d = data(), r = await fetch('/api/rsvp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(d) });
      const j = await r.json().catch(() => ({ code: 'failed' }));
      if (r.ok) { setBless(String(d.blessing ?? '')); setDone(true); if (d.blessing) window.dispatchEvent(new CustomEvent('kt-blessing', { detail: String(d.blessing) })); }
      else setErr(errs[j.code] ?? errs.failed);
    } catch { setErr(errs.failed); }
    setBusy(false);
  }
  function whatsapp() {
    const d = data(), names = events.filter(e => Array.isArray(d.events) && d.events.includes(e.id)).map(e => e.name.en).join(', ');
    window.open(waLink(`RSVP: ${d.name || ''}\nGuests: ${d.guests}\nEvents: ${names || '-'}\nMeal: ${d.meal}\nArrival: ${d.arrival || '-'}\n${d.blessing || ''}`), '_blank', 'noopener');
  }
  if (onPages && !js) return <p className="rsvp"><a className="btn" href={waLink('I would like to RSVP to the wedding.')} target="_blank" rel="noreferrer">Reply on WhatsApp</a></p>;
  if (done) return <div className="rsvp" role="status"><p className="h-te !text-5xl">Thank you</p><p className="lede"><T b={b('Your reply has reached us. We will be waiting for you.')} /></p>{bless && <p className="mt-4"><T b={b('Your blessing is floating on the river as a lamp.')} /></p>}</div>;
  const S = (n: number, title: Bi, kids: React.ReactNode) => <fieldset data-step={n} hidden={js && step !== n}><legend tabIndex={-1}><T b={title} /></legend>{kids}</fieldset>;
  return (
    <form ref={form} className="rsvp" action={onPages ? undefined : '/api/rsvp'} method="post" onSubmit={send} noValidate={js}>
      {js && <p className="text-sm mb-2" aria-live="polite">{L(b(`Step ${step + 1} of ${last + 1}`))}</p>}
      <div ref={box}>
        {onPages && <p>Choose your family contact in WhatsApp and send your reply there.</p>}
        {S(0, b('Who is coming?'), <>
          <label><T b={b('Name')} /><input name="name" autoComplete="name" required minLength={2} maxLength={80} /></label>
          <label><T b={b('Phone')} /><input name="phone" type="tel" autoComplete="tel" required pattern="(?:[^0-9]*[0-9]){8,15}[^0-9]*" maxLength={24} /></label>
          <label><T b={b('Number of guests')} /><input name="guests" type="number" inputMode="numeric" min={1} max={20} defaultValue={2} required /></label>
        </>)}
        {S(1, b('Which events?'), events.map(e => <label key={e.id} className="check"><input type="checkbox" name="events" value={e.id} defaultChecked={e.id === 'pelli'} /><span><T b={e.name} /> <small>· <T b={e.date} /></small></span></label>))}
        {S(2, b('Food and travel'), <>
          <label><T b={b('Meal preference')} /><select name="meal"><option value="veg">{L(b('Vegetarian'))}</option><option value="jain">{L(b('Jain'))}</option><option value="vegan">{L(b('Vegan'))}</option><option value="other">{L(b('Other or allergy'))}</option></select></label>
          <label><T b={b('Arrival help or allergies (optional)')} /><textarea name="arrival" rows={3} maxLength={300} /></label>
        </>)}
        {S(3, b('A blessing'), <label><T b={b('A few words for the couple (optional)')} /><textarea name="blessing" rows={4} maxLength={400} /></label>)}
      </div>
      <div className="hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <p role="alert" className="err">{err && <T b={err} />}</p>
      <div className="flex flex-wrap gap-3 mt-4">
        {js && step > 0 && <button type="button" className="btn ghost" onClick={() => go(step - 1)}><T b={b('Back')} /></button>}
        <button className="btn" disabled={busy}>{!js || step === last ? <T b={onPages ? b('Continue to WhatsApp') : busy ? b('Sending…') : b('Send reply')} /> : <T b={b('Next')} />}</button>
        {js && !onPages && <button type="button" className="btn ghost" onClick={whatsapp}><T b={b('Reply on WhatsApp')} /></button>}
      </div>
    </form>
  );
}
