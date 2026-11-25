import { wedding as w } from '@/config/wedding';
import { Curtain } from '@/components/Curtain';
import { Celebrations } from '@/components/Celebrations';
import { Invitation } from '@/components/Invitation';
import { Hero } from '@/components/Hero';
import { Nav } from '@/components/Nav';
import { Stage } from '@/components/Stage';
import { Album, Countdown, Night, Rings } from '@/components/Interactive';
import { Scene3D } from '@/components/three/Scene3D';
import { Vine } from '@/components/art';
import { H, Section } from '@/components/ui';
export default function Page() {
  return (
    <>
      <div id="page">
        <a className="skip" href="#shubhalekha">Skip to invitation</a>
        <Nav />
        <main>
          <Hero />
          <Section id="shubhalekha" label="Invitation" form="saree" from="r" to="l" ground="#F6E3C0"><Invitation /></Section>
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
