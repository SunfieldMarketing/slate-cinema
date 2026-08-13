import type { Metadata } from 'next'
import Link from 'next/link'
import { Mic, Scissors, Captions, Calendar, Radio, ArrowRight, Camera, FileVideo } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/PageHero'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import { MagicCard } from '@/components/ui/magic-card'
import { BorderBeam } from '@/components/ui/border-beam'
import { Marquee } from '@/components/ui/marquee'
import WeeklyEngine from '@/components/podcasts/WeeklyEngine'
import PodcastCaseStudy from '@/components/podcasts/PodcastCaseStudy'

/*
  Rebuilt 2026-08-13 — full restructure per Kauan: "completely redo the
  structure of podcast page and format and layout and build it out way
  more using premium ui/ux components." Swapped the plain-card v1
  (commit e4dda78) for MagicUI-sourced pieces already vendored in the
  repo (MagicCard's cursor-tracked glow, BorderBeam's traveling accent
  light, Marquee) plus two new bespoke pieces (WeeklyEngine,
  PodcastCaseStudy) built in the same visual language for the parts no
  off-the-shelf component covers (a real release-ops ladder, a video-
  backed case study panel).

  Content unchanged from v1 -- Real Talk episode/production numbers are
  as given in the audit doc. Still deliberately NOT included: specific
  Spotify/YouTube/Instagram handle URLs for Real Talk, or a claim that
  Miriam + Chaya have signed off on being featured -- doc flags both
  "VERIFY WITH JAKE BEFORE PUBLISH."
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

        {/* What's Included — bento-style grid, MagicCard hover glow */}
        <section className="relative w-full overflow-hidden py-20 md:py-24">
          <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-12">
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase">What&apos;s Included</span>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1]">
                Everything an episode needs, every time.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {included.map((item) => (
                <MagicCard
                  key={item.label}
                  className={`rounded-2xl p-6 ${item.big ? 'sm:col-span-2 lg:col-span-1 lg:row-span-2' : ''}`}
                  gradientColor="#00AEEF22"
                  gradientFrom="#00AEEF"
                  gradientTo="#0ea5e9"
                >
                  <div className="w-11 h-11 rounded-full border border-[#00AEEF]/40 bg-ink flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,174,239,0.2)]">
                    <item.icon className="w-5 h-5 text-[#00AEEF]" />
                  </div>
                  <div className="text-white font-bold text-sm mb-1.5">{item.label}</div>
                  <p className="text-white/50 text-xs font-light leading-relaxed">{item.desc}</p>
                </MagicCard>
              ))}
            </div>
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
