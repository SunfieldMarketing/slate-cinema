import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import IntakeFrame from '@/components/IntakeFrame'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    path: '/contact/project',
    title: 'Project Intake',
    description:
      'Tell us about your project — goals, timeline, and budget — and we’ll follow up with a fixed-price proposal within minutes.',
  })
}

export default function ProjectIntakePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white">
      <Nav />
      <h1 className="sr-only">Project intake: tell us about your project</h1>
      {/* The intake brief is a self-contained bundled app (its own HTML
          document, styling, and multi-step JS) — embedded rather than
          reimplemented so it stays byte-identical to the delivered file.
          Contained in a smaller, bordered card instead of a full-bleed
          h-screen frame, per feedback that the intake form read as too
          large/overwhelming on its own page.
          IntakeFrame (not a plain <iframe>) mirrors each submission into
          the CMS without touching intake.html itself -- see its own
          comment for how. */}
      {/* 2026-11-04 (Oct 27 audit #29): grows on wide screens (it was a 896px panel floating in
          an empty 1920px page) and gets the site's viewfinder corner brackets; IntakeFrame
          re-themes the brief itself to the site's type and colours. */}
      <div className="pt-20 pb-4 px-2 sm:pt-28 sm:pb-16 sm:px-6">
        <div className="relative max-w-4xl xl:max-w-6xl mx-auto">
          <span aria-hidden className="hidden sm:block absolute -top-3 -left-3 w-6 h-6 border-l border-t border-white/25" />
          <span aria-hidden className="hidden sm:block absolute -top-3 -right-3 w-6 h-6 border-r border-t border-white/25" />
          <span aria-hidden className="hidden sm:block absolute -bottom-3 -left-3 w-6 h-6 border-l border-b border-white/25" />
          <span aria-hidden className="hidden sm:block absolute -bottom-3 -right-3 w-6 h-6 border-r border-b border-white/25" />
          <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            <IntakeFrame />
          </div>
        </div>
      </div>
    </main>
  )
}
