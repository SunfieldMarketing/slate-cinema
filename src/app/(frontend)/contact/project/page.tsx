import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import IntakeFrame from '@/components/IntakeFrame'

export const metadata: Metadata = {
  title: 'Project Intake',
  description:
    'Tell us about your project — goals, timeline, and budget — and we’ll follow up with a fixed-price proposal within minutes.',
}

export default function ProjectIntakePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white">
      <Nav />
      {/* The intake brief is a self-contained bundled app (its own HTML
          document, styling, and multi-step JS) — embedded rather than
          reimplemented so it stays byte-identical to the delivered file.
          Contained in a smaller, bordered card instead of a full-bleed
          h-screen frame, per feedback that the intake form read as too
          large/overwhelming on its own page.
          IntakeFrame (not a plain <iframe>) mirrors each submission into
          the CMS without touching intake.html itself -- see its own
          comment for how. */}
      <div className="pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <IntakeFrame />
        </div>
      </div>
    </main>
  )
}
