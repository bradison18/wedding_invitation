import { events } from '@/config/wedding';
import { ics } from '@/lib/links';
export function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('event');
  const list = id ? events.filter(e => e.id === id) : events;
  if (!list.length) return new Response('Not found', { status: 404 });
  return new Response(ics(list), { headers: { 'content-type': 'text/calendar; charset=utf-8', 'content-disposition': 'attachment; filename="wedding.ics"' } });
}
