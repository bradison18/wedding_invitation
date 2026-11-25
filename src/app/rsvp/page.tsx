import type { Metadata } from 'next';
import { wedding as w } from '@/config/wedding';
import { RsvpForm } from '@/components/RsvpForm';
export const metadata: Metadata = { title: 'RSVP' };
export default async function Rsvp({ searchParams }: { searchParams: Promise<{ result?: string | string[] }> }) {
  const { result } = await searchParams;
  return <main className="rsvp-page"><p><a href="/">← {w.groom.name.en} &amp; {w.bride.name.en}</a></p><h1 className="h-te">Will you join us?</h1><RsvpForm initial={typeof result === 'string' ? result : undefined} /></main>;
}
