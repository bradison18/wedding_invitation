import 'server-only';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
export type Rsvp = { name: string; phone: string; guests: number; events: string[]; meal: string; arrival: string; blessing: string; at: string };
export interface RsvpStore { save(r: Rsvp): Promise<void> }
const file: RsvpStore = { async save(r) { const d = path.join(process.cwd(), 'data'); await mkdir(d, { recursive: true }); await appendFile(path.join(d, 'rsvps.jsonl'), JSON.stringify(r) + '\n'); } };
const webhook: RsvpStore = { async save(r) {
  const res = await fetch(process.env.RSVP_WEBHOOK_URL!, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(r), signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`webhook ${res.status}`);
} };
/** Add a database by implementing RsvpStore and returning it here. null = not configured. */
export function getStore(): RsvpStore | null {
  if (process.env.RSVP_STORAGE === 'file') return file;
  if (process.env.RSVP_STORAGE === 'webhook' && process.env.RSVP_WEBHOOK_URL) return webhook;
  return null;
}
