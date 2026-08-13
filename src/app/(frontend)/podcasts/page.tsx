import type { Metadata } from 'next'
import Link from 'next/link'
import { Mic, Scissors, Captions, Rows3, Calendar, Radio, Users, ArrowRight } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/PageHero'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'

/*
  New page (added 2026-08-13, per the audit doc's "Podcasts (NEW)" build
  brief): "Podcast production as a service - proven on our own show,
  every single week." Built as its own standalone route (not a Payload
  `industries` entry) since the doc's section list -- Hero / Weekly
  Engine / What's Included / two case studies / CTA -- doesn't match the
  bento-card+gallery shape IndustryPageContent renders for the other 9
  verticals, and forcing it into that shape would either drop sections
  or misrepresent them.

  Real Talk episode/production numbers below are as given in the doc.
  Deliberately NOT included: specific Spotify/YouTube/Instagram handle
  URLs for Real Talk, and no claim that Miriam + Chaya have signed off on
  being featured -- the doc flags both as "VERIFY WITH JAKE BEFORE
  PUBLISH" (channel URLs weren't wired into the system as of 8/10, and
  the hosts' OK wasn't confirmed). Platforms are named generically
  (Spotify, YouTube, Instagram, Facebook, Amazon, Apple) without linking
  to a specific unverified handle.
*/

export const metadata: Metadata = {
  title: 'Podcast Production',
  description:
    'Podcast production as a service, proven on our own show every single week — full episodes, concept-titled reels, thumbnails, captions, and carousels, on a real release calendar.',
}

const weeklyEngine = [
  { day: 'Monday', label: 'Full Episode', desc: 'The complete episode edit, mixed and mastered to podcast loudness spec.' },
  { day: 'Tuesday', label: 'Reel 1', desc: 'First concept-titled clip, cut for the feed.' },
  { day: 'Thursday', label: 'Reel 2', desc: 'Second concept-titled clip — a different beat from the same episode.' },
  { day: 'Saturday', label: 'Reel 3', desc: 'Third concept-titled clip, timed to lead into Sunday’s drop.' },
  { day: 'Sunday', label: 'The Drop', desc: 'Full episode goes live everywhere, on schedule, every week.' },
]

const included = [
  { icon: Rows3, label: 'Set design + studio build', desc: 'We designed and built the physical set the show is recorded on.' },
  { icon: Mic, label: 'Multi-cam filming', desc: 'Dedicated per-guest audio, cut multi-camera for a real broadcast feel.' },
  { icon: Scissors, label: 'Full-episode edit', desc: 'Every episode edited start to finish, ready to publish.' },
  { icon: Rows3, label: '3 concept-titled reels / episode', desc: 'Not auto-clipped highlights — reels built around an actual hook.' },
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

        {/* The Weekly Engine — the release ladder */}
        <section className="relative w-full overflow-hidden py-16 md:py-20">
          <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-12">
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase">The Weekly Engine</span>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1]">
                A real release calendar,<br className="hidden sm:block" /> not a promise.
              </h2>
              <p className="mt-5 text-white/55 font-light text-sm sm:text-base max-w-xl mx-auto">
                Most agencies can&apos;t show you a real release-ops calendar. We can — because we run one on ourselves, every week.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {weeklyEngine.map((step, i) => (
                <div key={step.day} className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[#00AEEF]/70 uppercase mb-2">{step.day}</div>
                  <div className="text-white font-bold text-sm mb-1.5">{step.label}</div>
                  <p className="text-white/50 text-xs font-light leading-relaxed">{step.desc}</p>
                  {i < weeklyEngine.length - 1 && (
                    <ArrowRight className="hidden sm:block absolute top-1/2 -right-3 -translate-y-1/2 w-4 h-4 text-white/20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="relative w-full overflow-hidden py-16 md:py-20 border-t border-white/5">
          <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-12">
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase">What&apos;s Included</span>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1]">
                Everything an episode needs, every time.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {included.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6">
                  <div className="w-11 h-11 rounded-full border border-[#00AEEF]/40 bg-ink flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,174,239,0.2)]">
                    <item.icon className="w-5 h-5 text-[#00AEEF]" />
                  </div>
                  <div className="text-white font-bold text-sm mb-1.5">{item.label}</div>
                  <p className="text-white/50 text-xs font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case study: Real Talk */}
        <section className="relative w-full overflow-hidden py-16 md:py-20 border-t border-white/5">
          <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase">Case Study</span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tighter text-white leading-[1.1] mb-5">Real Talk</h2>
              <p className="text-white/60 font-light text-sm sm:text-base leading-relaxed mb-6">
                A weekly conversation show produced end-to-end by Slate — from the studio it&apos;s filmed in to
                the reels that circulate after it drops. Season 1 ran 15 episodes, released every Sunday without
                missing a week, with guests ranging from rabbis to an OB-GYN to a DJ.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-2xl font-black text-white">15</div>
                  <div className="text-[11px] text-white/45 font-mono uppercase tracking-wide">Episodes, S1</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">31</div>
                  <div className="text-[11px] text-white/45 font-mono uppercase tracking-wide">Clips, one episode</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">~1TB</div>
                  <div className="text-[11px] text-white/45 font-mono uppercase tracking-wide">Footage per shoot</div>
                </div>
              </div>
              <p className="text-white/40 text-xs font-light leading-relaxed">
                Distributed weekly across Spotify, YouTube, Instagram, Facebook, Amazon and Apple — Slate built
                the channels the show runs on.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-white/[0.03]">
              <video src="/videos/post-production.mp4" className="w-full h-full object-cover" muted loop autoPlay playsInline />
            </div>
          </div>
        </section>

        {/* Case study: World Within */}
        <section className="relative w-full overflow-hidden py-16 md:py-20 border-t border-white/5">
          <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-white/[0.03]">
              <video src="/videos/production.mp4" className="w-full h-full object-cover" muted loop autoPlay playsInline />
            </div>
            <div className="order-1 lg:order-2">
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase">Case Study</span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tighter text-white leading-[1.1] mb-5">World Within</h2>
              <p className="text-white/60 font-light text-sm sm:text-base leading-relaxed mb-6">
                A client-side show run the same way we run our own: multi-camera filming with dedicated
                per-guest audio, so the finished episode sounds as clean as it looks. <span className="text-white/80">Your show, our crew.</span>
              </p>
              <div className="flex items-center gap-3 text-white/50 text-sm">
                <Users className="w-4 h-4 text-[#00AEEF]" />
                Multi-cam + dedicated per-guest audio
              </div>
            </div>
          </div>
        </section>

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
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold text-black bg-white hover:bg-[#00AEEF] hover:text-white transition-colors duration-300"
            >
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
