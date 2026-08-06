import type { Metadata } from 'next'
import { CalendarClock } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/PageHero'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import CustomCalendar from '@/components/CustomCalendar'
import IntakeCTABand from '@/components/IntakeCTABand'
import { resolveIcon } from '@/lib/icon-map'
import { getScheduleACallPageGlobal, getReadyToTalk } from '@/lib/payload-data'
import type { ReadyToTalk as ReadyToTalkGlobal } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Schedule a Call | Slate Cinema',
  description:
    'Book a 20-minute call with our team to talk through your project, timeline, and budget — no pitch deck, just an honest read on scope.',
}

const fallbackPrepItems = [
  { icon: 'Target', label: 'Your goals', desc: 'What the video needs to do for your business.' },
  { icon: 'Clock3', label: 'Your timeline', desc: 'When you need it shot, edited, and live.' },
  { icon: 'Wallet', label: 'A budget ballpark', desc: 'Rough range is fine — it keeps the call efficient.' },
  { icon: 'Sparkles', label: 'Any references', desc: 'Links or examples you like are a bonus, not required.' },
]

/* Trust badge — matches the pill used on the Contact page's "Ready to
   Talk" section so this page's framing carries the same visual language. */
function TrustBadge({ icon: Icon, label }: { icon: typeof CalendarClock; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/30 bg-white/[0.06] backdrop-blur-sm text-white/70 text-[11px] font-mono tracking-wide uppercase shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
      <Icon className="w-3.5 h-3.5 text-emerald-400" />
      {label}
    </span>
  )
}

/* ── "Book a time on our calendar" framing — the same Ready to Talk
   module that lives on the Contact page, brought over here so this page
   stands on its own instead of assuming you arrived from Contact. ───── */
function CallFraming({ copy }: { copy: ReadyToTalkGlobal | null }) {
  const eyebrow = copy?.eyebrow || '// Ready to Talk'
  const headline = copy?.headline || 'Book a time on our calendar'
  const description =
    copy?.description ||
    'It’s a quick 20-minute call — no pitch deck, just an honest read on scope, timeline, and budget so you know exactly where you stand. To make the most of it, have a rough sense of the following ready.'
  const badges = copy?.badges?.length
    ? copy.badges
    : [{ icon: 'Clock3', label: '20-Minute Call' }, { icon: 'Users', label: 'Talk to a Real Producer' }, { icon: 'ShieldCheck', label: 'No Pitch Deck' }]
  const prepItems = copy?.prepItems?.length ? copy.prepItems : fallbackPrepItems

  return (
    <section className="relative w-full overflow-hidden pt-16 pb-4 md:pt-20">
      <div className="relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="w-12 h-12 shrink-0 rounded-full border border-emerald-400/40 bg-ink flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <CalendarClock className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-emerald-400 uppercase">{eyebrow}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1] mb-5">{headline}</h2>
        <p className="text-white/60 font-light text-base sm:text-lg leading-relaxed">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {badges.map((b) => {
            const Icon = resolveIcon(b.icon)
            return <TrustBadge key={b.label} icon={Icon} label={b.label} />
          })}
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {prepItems.map((p) => {
            const Icon = resolveIcon(p.icon)
            return (
              <div key={p.label} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6">
                <div className="w-10 h-10 mx-auto rounded-full border border-[#00AEEF]/40 bg-ink flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,174,239,0.2)]">
                  <Icon className="w-4 h-4 text-[#00AEEF]" />
                </div>
                <div className="text-white font-bold text-sm mb-1.5">{p.label}</div>
                <p className="text-white/50 text-xs font-light leading-relaxed">{p.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default async function ScheduleACallPage() {
  const [page, readyToTalk] = await Promise.all([getScheduleACallPageGlobal(), getReadyToTalk()])
  const hero = page?.hero

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-[#00AEEF] selection:text-white">
      <AmbientBackdrop accent="#00AEEF" />

      <div className="relative z-10 w-full">
        <Nav />
        <PageHero
          eyebrow={hero?.eyebrow || 'Schedule a Call'}
          title={[hero?.titleLine1 || "Let's talk", hero?.titleLine2 || 'it through']}
          subtitle={hero?.subtitle || "Grab a time that works for you. We'll walk through your project, timeline, and budget — and outline exactly what happens next."}
          accent="#00AEEF"
        />

        <CallFraming copy={readyToTalk} />

        <CustomCalendar copy={page?.calendar} />

        <IntakeCTABand />

        <Footer />
      </div>
    </main>
  )
}
