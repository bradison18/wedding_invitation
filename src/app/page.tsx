import Image from 'next/image';
import { events, wedding as w } from '@/config/wedding';
import { Curtain } from '@/components/Curtain';
import { Celebrations } from '@/components/Celebrations';
import { Hero } from '@/components/Hero';
import { Nav } from '@/components/Nav';
import { Stage } from '@/components/Stage';
import { Album, Countdown, Night, Rings } from '@/components/Interactive';
import { Scene3D } from '@/components/three/Scene3D';
import { Vine } from '@/components/art';
import { gcal } from '@/lib/links';
import { H, Section } from '@/components/ui';
import garlands from '@/photos/garlands.jpg';
export default function Page() {
  const couple = `${w.groom.name.en} and ${w.bride.name.en}`;
  const Family = ({ p, role }: { p: typeof w.bride; role: string }) => <div><h3 className="h3-te">{p.formal.en}</h3><p className="mt-2">{p.grand.en}</p><p className="mt-1">{role} <b>{p.parents.en}</b></p></div>;
  return (
    <>
      <div id="page">
        <a className="skip" href="#shubhalekha">Skip to invitation</a>
        <Nav />
        <main>
          <Hero />
          <Section id="shubhalekha" label="Invitation" form="saree" from="r" to="l" ground="#F6E3C0">
            <div className="unfold card">
              <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
              <div className="card-in">
                <div>
                  <p className="text-madder text-lg">Srirasthu · Subhamasthu · Avighnamasthu</p>
                  <h2 className="h-te">Wedding Invitation</h2>
                  <p className="lede mt-4"><b>{w.groom.parents.en}</b> cordially solicit your gracious presence with family on the auspicious occasion of the marriage of our only son</p>
                  <div className="families"><Family p={w.groom} role="Only son of" /><Family p={w.bride} role="Daughter of" /></div>
                  <p className="text-lg"><b>Muhurtham</b><br />{w.muhurtham.date.en}<br />{w.muhurtham.time.en}<br />{w.muhurtham.panchangam.en}</p>
                  <p className="mt-4 text-lg"><b>{w.venue.name.en}</b><br />{w.venue.address.en}<br />Dinner: 18-12-2026, 7:30 pm onwards</p>
                  <p className="flex flex-wrap gap-3 mt-4"><a className="btn" href={w.venue.map} target="_blank" rel="noreferrer">Google Maps</a><a className="btn ghost" href={gcal(events[1])} target="_blank" rel="noreferrer">Add to calendar</a></p>
                  <p className="mt-6">Yours,<br /><b>{w.contacts[0].name.en}</b></p><p className="mt-2">With best compliments from near and dear</p>
                </div>
                <figure><Image src={garlands} alt={`${couple} in jasmine and lotus garlands`} sizes="(max-width:1024px) 88vw, 420px" placeholder="blur" /></figure>
              </div>
            </div>
          </Section>
          <Rings />
          <Section id="muggu" label="Countdown" form="garland" from="l" to="r" ground="#F8EBCB"><H title="Counting down" kicker="Until the celebration begins." /><Countdown /></Section>
          <Section id="events" label="Events" form="saree" from="r" to="l" ground="#F7E4BE"><H title="The celebrations" kicker="Three doorways, opened for you." /><Celebrations /></Section>
          <Section id="album" label="Album" form="saree" from="l" to="r" ground="#EBC4A2"><div className="relative"><Vine className="vine" /><H title="The album" /></div><Album /></Section>
          <div className="dusk" aria-hidden="true" />
          <section className="night3d" aria-label="Lamps on the Krishna"><Scene3D kind="night" className="fill" label="Oil lamps drifting on the night river below the lights of Prakasam Barrage" action="Float a lamp" /></section>
          <Section id="night" label="RSVP" form="stars" from="r" to="l" ground="#16294A" className="night"><H title="Will you join us?" kicker="Send your reply. Each blessing becomes a lamp on the river." /><Night /></Section>
        </main>
        <footer className="foot"><div className="wrap"><p className="h-te">Thank you</p>
          <div className="families">{w.contacts.map(c => <p key={c.who.en}><b>{c.who.en}</b><br />{c.name.en}{c.phone && <><br /><a href={`tel:${c.phone}`}>{c.phone}</a></>}</p>)}</div>
          {w.hashtag && <p>{w.hashtag}</p>}<p className="mt-4"><a href="/simple">Simple view</a></p></div></footer>
      </div>
      <Curtain /><Stage />
    </>
  );
}
