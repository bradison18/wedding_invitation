import { events } from '@/config/wedding';
import { ics } from '@/lib/links';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return events.map(event => ({ file: `${event.id}.ics` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const event = events.find(item => `${item.id}.ics` === file);
  if (!event) return new Response(null, { status: 404 });
  return new Response(ics([event]), { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
}
