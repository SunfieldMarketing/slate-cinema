import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock3, PlayCircle, Mail } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/PageHero'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import ThankYouTracking from '@/components/ThankYouTracking'

// noindex: this is a conversion-confirmation page, not something that
// should show up in search results or get direct organic traffic.
export const metadata: Metadata = {
  title: 'Thank You',
  description: "We've got your submission — here's what happens next.",
  robots: { index: false, follow: false },
}

const nextSteps = [
  {
    icon: Mail,
    title: 'Check your inbox',
    body: 'A confirmation just landed — reply to it any time if you think of something to add.',
  },
  {
    icon: Clock3,
    title: 'Replies within minutes',
    body: 'A real producer reviews every submission personally — no queue, no bot.',
  },
  {
    icon: PlayCircle,
    title: 'See more of our work',
    body: 'While you wait, take a look at recent projects across every industry we shoot.',
  },
]

export default function ThankYouPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-[#00AEEF] selection:text-white">
      <AmbientBackdrop accent="#10b981" />
      <Suspense fallback={null}>
        <ThankYouTracking />
      </Suspense>

      <div className="relative z-10 w-full">
        <Nav />

        <PageHero
          eyebrow="Submission Received"
          title={['Got it —', "we're on it."]}
          subtitle="Thanks for reaching out to Slate Cinema. Your message is already in front of the team."
          accent="#10b981"
        />

        <section className="relative w-full overflow-hidden py-12 md:py-16">
          <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8">
            <div className="flex items-center justify-center gap-3 mb-10">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <span className="font-mono text-xs sm:text-sm tracking-[0.25em] text-emerald-400 uppercase">Confirmed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
              {nextSteps.map((s) => (
                <div key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 text-center">
                  <div className="w-11 h-11 mx-auto rounded-full border border-emerald-400/40 bg-ink flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <s.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-white font-bold text-sm mb-1.5">{s.title}</div>
                  <p className="text-white/55 text-xs font-light leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/portfolio"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold text-black bg-white hover:bg-[#00AEEF] hover:text-white transition-colors duration-300 w-full sm:w-auto"
              >
                View Our Work
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold text-white border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors duration-300 w-full sm:w-auto"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
