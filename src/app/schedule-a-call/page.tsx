import type { Metadata } from 'next'
import { Target, Clock3, Wallet } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/PageHero'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import CustomCalendar from '@/components/CustomCalendar'
import IntakeCTABand from '@/components/IntakeCTABand'

export const metadata: Metadata = {
  title: 'Schedule a Call | Slate Cinema',
  description:
    'Book a 20-minute call with our team to talk through your project, timeline, and budget — no pitch deck, just an honest read on scope.',
}

const prepItems = [
  { icon: Target, label: 'Your goals', desc: 'What the video needs to do for your business.' },
  { icon: Clock3, label: 'Your timeline', desc: 'When you need it shot, edited, and live.' },
  { icon: Wallet, label: 'A budget ballpark', desc: 'Rough range is fine — it keeps the call efficient.' },
]

function CallFraming() {
  return (
    <section className="relative w-full overflow-hidden pt-16 pb-4 md:pt-20">
      <div className="relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <p className="text-white/60 font-light text-base sm:text-lg leading-relaxed">
          It’s a quick 20-minute call — no pitch deck, just an honest read on scope. To make the most of it, have a
          rough sense of the following ready.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {prepItems.map((p) => (
            <div key={p.label} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6">
              <div className="w-10 h-10 mx-auto rounded-full border border-[#00AEEF]/40 bg-ink flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,174,239,0.2)]">
                <p.icon className="w-4 h-4 text-[#00AEEF]" />
              </div>
              <div className="text-white font-bold text-sm mb-1.5">{p.label}</div>
              <p className="text-white/50 text-xs font-light leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ScheduleACallPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-[#00AEEF] selection:text-white">
      <AmbientBackdrop accent="#00AEEF" />

      <div className="relative z-10 w-full">
        <Nav />
        <PageHero
          eyebrow="Schedule a Call"
          title={['Let’s talk', 'it through']}
          subtitle="Grab a time that works for you. We’ll walk through your project, timeline, and budget — and outline exactly what happens next."
          accent="#00AEEF"
        />

        <CallFraming />

        <CustomCalendar />

        <IntakeCTABand />

        <Footer />
      </div>
    </main>
  )
}
