import type { Metadata } from 'next'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Project Intake',
  description:
    'Tell us about your project — goals, timeline, and budget — and we’ll follow up with a fixed-price proposal within one business day.',
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
          large/overwhelming on its own page. */}
      <div className="pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <iframe
            src="/intake.html"
            title="Slate Cinema project intake brief"
            className="block w-full h-[75vh] border-0"
          />
        </div>
      </div>
    </main>
  )
}
