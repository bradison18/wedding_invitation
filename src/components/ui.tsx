import type { Bi } from '@/config/wedding';
import { Suspense } from 'react'; // boundaries let React hydrate scene by scene
import { River, type Form } from './River';
export const T = ({ b }: { b: Bi }) => <>{b.en}</>;
export const H = ({ title, kicker }: { title: string; kicker?: string }) => (
  <header className="mb-10 max-w-3xl"><h2 className="h-te">{title}</h2>{kicker && <p className="lede mt-4">{kicker}</p>}</header>
);
export function Section({ id, label, form, from, to, ground, className = '', children }: { id: string; label: string; form: Form; from: 'l' | 'r'; to: 'l' | 'r'; ground: string; className?: string; children: React.ReactNode }) {
  return <section id={id} aria-label={label} data-ground={ground} className={`scene ${className}`}><River form={form} from={from} to={to} /><div className="wrap"><Suspense>{children}</Suspense></div></section>;
}
