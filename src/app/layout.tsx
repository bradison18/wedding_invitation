import { sitePath } from '@/lib/links';
import type { Metadata, Viewport } from 'next';
import { Anek_Latin, Marcellus } from 'next/font/google';
import { wedding as w } from '@/config/wedding';
import './globals.css';
const marc = Marcellus({ weight: '400', subsets: ['latin'], variable: '--f-la', display: 'swap' });
const anek = Anek_Latin({ subsets: ['latin'], variable: '--f-body', display: 'swap' });
const title = `${w.groom.name.en} & ${w.bride.name.en}`;
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'), title: { default: title, template: `%s | ${w.groom.name.en} & ${w.bride.name.en}` },
  description: `${w.muhurtham.date.en}, ${w.city.en}. You are warmly invited.`, robots: { index: false },
  openGraph: { title, description: `${w.muhurtham.date.en} · ${w.city.en}`, images: [{ url: sitePath('/og.jpg'), width: 1200, height: 630 }] }, twitter: { card: 'summary_large_image' },
};
export const viewport: Viewport = { themeColor: '#E9D6C6' };
const boot = `(function(){var d=document.documentElement;d.classList.add('js');})()`;
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning className={`${marc.variable} ${anek.variable}`}><head><script dangerouslySetInnerHTML={{ __html: boot }} /></head><body>{children}</body></html>;
}
