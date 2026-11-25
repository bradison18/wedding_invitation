import { NextResponse, type NextRequest } from 'next/server';
import { events } from '@/config/wedding';
import { getStore, type Rsvp } from '@/lib/storage';

const hits = new Map<string, { n: number; until: number }>();
function limited(ip: string) {
  const now = Date.now();
  if (hits.size > 5000) for (const [k, h] of hits) if (h.until < now) hits.delete(k);
  const h = hits.get(ip);
  if (!h || h.until < now) { hits.set(ip, { n: 1, until: now + 600_000 }); return false; }
  return ++h.n > 8;
}
const str = (v: unknown, n: number) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n) : '');

export async function POST(req: NextRequest) {
  const isForm = !(req.headers.get('content-type') ?? '').includes('application/json');
  const reply = (status: number, code: string) => isForm
    ? new NextResponse(null, { status: 303, headers: { Location: `/rsvp?result=${code}` } })
    : NextResponse.json({ code }, { status });
  if (Number(req.headers.get('content-length') ?? 0) > 20_000) return reply(413, 'invalid');
  // Reject cross-site posts.
  const origin = req.headers.get('origin');
  if (origin && origin !== 'null' && new URL(origin).host !== req.headers.get('host')) return reply(403, 'invalid');
  if (limited(req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local')) return reply(429, 'slow');
  let d: Record<string, unknown>;
  try {
    if (isForm) { const f = await req.formData(); d = { ...Object.fromEntries(f), events: f.getAll('events') }; }
    else d = await req.json();
    if (!d || typeof d !== 'object') throw 0;
  } catch { return reply(400, 'invalid'); }
  if (str(d.website, 50)) return reply(200, 'ok'); // honeypot: pretend success
  const guests = Number(d.guests);
  const ids = new Set(events.map(e => e.id));
  const r: Rsvp = {
    name: str(d.name, 80), phone: str(d.phone, 24), guests,
    events: (Array.isArray(d.events) ? d.events : []).filter((e): e is string => ids.has(e)),
    meal: ['veg', 'jain', 'vegan', 'other'].includes(String(d.meal)) ? String(d.meal) : 'veg',
    arrival: str(d.arrival, 300), blessing: str(d.blessing, 400), at: new Date().toISOString(),
  };
  if (r.name.length < 2 || r.phone.replace(/\D/g, '').length < 8 || !Number.isInteger(guests) || guests < 1 || guests > 20) return reply(422, 'invalid');
  const store = getStore();
  if (!store) return reply(503, 'unconfigured');
  try { await store.save(r); return reply(200, 'ok'); } catch (e) { console.error('rsvp save failed', e); return reply(502, 'failed'); }
}
