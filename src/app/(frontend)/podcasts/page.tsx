import type { Metadata } from 'next'
import Link from 'next/link'
import { Mic, Scissors, Captions, Calendar, Radio, ArrowRight, Camera, FileVideo } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/PageHero'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import { BorderBeam } from '@/components/ui/border-beam'
import { Marquee } from '@/components/ui/marquee'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal'
import WeeklyEngine from '@/components/podcasts/WeeklyEngine'
import PodcastCaseStudy from '@/components/podcasts/PodcastCaseStudy'

/*
  Second full rebuild, 2026-08-13 — Kauan: "completely rebuild and redo
  the layout structure and podcast page from start to finish." The v2
  MagicUI pass (commit d366b55) kept the same page skeleton as every
  other page (hero -> grid -> cards -> CTA) just with nicer cards; this
  pass changes the actual STRUCTURE, not just the component dressing:

  - ContainerScroll (tilt-in 3D card reveal, previously unused anywhere
    on the site) replaces a second static section right under the hero
    — the page now opens with a physical, dimensional reveal of the set
    instead of another flat block.
  - StickyScroll (pinned text column + a media panel that swaps per
    active item, previously unused) replaces the What's Included bento
    grid — scroll-driven instead of a static card wall, and structurally
    different from the bento pattern every other rebuilt page uses.
  - WeeklyEngine and PodcastCaseStudy (built for v2) are kept — they
    were the parts of v2 that were already structurally distinct from
    the site's default template, not generic dressing.

  Content unchanged: Real Talk episode/production numbers are as given
  in the audit doc. Still deliberately NOT included: specific Spotify/
  YouTube/Instagram handle URLs for Real Talk, or a claim that Miriam +
  Chaya have signed off on being featured -- doc flags both "VERIFY
  WITH JAKE BEFORE PUBLISH."
*/

export const metadata: Metadata = {
  title: 'Podcast Production',
  description:
    'Podcast production as a service, proven on our own show every single week — full episodes, concept-titled reels, thumbnails, captions, and carousels, on a real release calendar.',
}

const platforms = ['Spotify', 'YouTube', 'Instagram', 'Facebook', 'Amazon Music', 'Apple Podcasts']

const included = [
  { icon: Camera, label: 'Set design + studio build', desc: 'We designed and built the physical set the show is recorded on.', big: true },
  { icon: Mic, label: 'Multi-cam filming', desc: 'Dedicated per-guest audio, cut multi-camera for a real broadcast feel.' },
  { icon: Scissors, label: 'Full-episode edit', desc: 'Every episode edited start to finish, ready to publish.' },
  { icon: FileVideo, label: '3 concept-titled reels', desc: 'Not auto-clipped highlights — reels built around an actual hook.' },
  { icon: Captions, label: 'Thumbnails + captions + carousels', desc: 'Every platform-ready asset an episode needs, no extra ask.' },
  { icon: Calendar, label: 'Distribution-ready exports', desc: 'Dedicated podcast loudness presets, built into our in-house editor.' },
]

export default function PodcastsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-[#00AEEF] selection:text-white">
      <AmbientBackdrop accent="#00AEEF" />

      <div className="relative z-10 w-full">
        <Nav />

        <PageHero
          eyebrow="Podcast Production"
          title={['We ship a full episode', 'and three reels — every week.']}
          subtitle="Podcast production as a service, proven on our own show. Set design, multi-cam filming, editing, and a full release calendar — run the way an in-house team would run it, for your show instead of ours."
          videoSrc="/videos/post-production.mp4"
          accent="#00AEEF"
        />

        {/* Tilt-in reveal of the set -- a physical, dimensional moment
            instead of another flat section. Real proof point: we designed
            and built the studio the show films in, not a rented space. */}
        <ContainerScroll
          titleComponent={
            <div>
              <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase mb-5">
                <span className="w-8 h-px bg-[#00AEEF]/40" /> The Set
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1]">
                We designed and built<br />the room it&apos;s filmed in.
              </h2>
            </div>
          }
        >
          <video src="/videos/post-production.mp4" className="w-full h-full object-cover" muted loop autoPlay playsInline />
        </ContainerScroll>

        {/* Distribution platforms — named generically, no specific handle URLs */}
        <div className="relative border-y border-white/5 py-5 overflow-hidden">
          <Marquee pauseOnHover className="[--duration:32s]">
            {platforms.map((p) => (
              <span key={p} className="mx-6 font-mono text-xs tracking-[0.25em] uppercase text-white/35">
                {p}
              </span>
            ))}
          </Marquee>
        </div>

        <WeeklyEngine />

        {/* What's Included — pinned text column, scroll-driven media panel
            (StickyScroll) instead of a static card wall. */}
        <section className="relative w-full overflow-hidden py-20 md:py-24">
          <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-12">
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase">What&apos;s Included</span>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1]">
                Everything an episode needs, every time.
              </h2>
            </div>
            <StickyScroll
              content={included.map((item) => ({
                title: item.label,
                description: item.desc,
                color: '#00AEEF',
                content: (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#00AEEF]/15 to-ink">
                    <item.icon className="w-16 h-16 text-[#00AEEF]/70" />
                  </div>
                ),
              }))}
            />
          </div>
        </section>

        <PodcastCaseStudy
          eyebrow="Case Study"
          title="Real Talk"
          video="/videos/post-production.mp4"
          body="A weekly conversation show produced end-to-end by Slate — from the studio it's filmed in to the reels that circulate after it drops. Season 1 ran 15 episodes, released every Sunday without missing a week, with guests ranging from rabbis to an OB-GYN to a DJ."
          stats={[
            { value: '15', label: 'Episodes, S1' },
            { value: '31', label: 'Clips, one episode' },
            { value: '~1TB', label: 'Footage per shoot' },
          ]}
          footnote="Distributed weekly across Spotify, YouTube, Instagram, Facebook, Amazon and Apple — Slate built the channels the show runs on."
        />

        <PodcastCaseStudy
          eyebrow="Case Study"
          title="World Within"
          video="/videos/production.mp4"
          body="A client-side show run the same way we run our own: multi-camera filming with dedicated per-guest audio, so the finished episode sounds as clean as it looks."
          highlight="Your show, our crew."
          reverse
          tag={{ icon: 'Users', label: 'Multi-cam + dedicated per-guest audio' }}
        />

        {/* CTA */}
        <section className="relative w-full overflow-hidden py-16 md:py-24 border-t border-white/5">
          <div className="relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-full border border-[#00AEEF]/40 bg-ink flex items-center justify-center mb-6 shadow-[0_0_24px_rgba(0,174,239,0.25)]">
              <Radio className="w-6 h-6 text-[#00AEEF]" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1] mb-5">
              Run your show like a real production.
            </h2>
            <p className="text-white/55 font-light text-sm sm:text-base max-w-xl mx-auto mb-8">
              A premium monthly retainer, built around your release schedule — talk it through with us before we quote anything.
            </p>
            <Link
              href="/contact#get-started"
              className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold text-black bg-white hover:bg-[#00AEEF] hover:text-white transition-colors duration-300 overflow-hidden"
            >
              <BorderBeam size={80} duration={5} colorFrom="#00AEEF" colorTo="#ffffff" />
              Talk To Us About Your Show
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
