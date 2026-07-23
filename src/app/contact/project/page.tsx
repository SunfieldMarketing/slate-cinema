import type { Metadata } from 'next'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Project Intake | Slate Cinema',
  description:
    'Tell us about your project — goals, timeline, and budget — and we’ll follow up with a fixed-price proposal within one business day.',
}

export default function ProjectIntakePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white">
      <Nav />
      {/* The intake brief is a self-contained bundled app (its own HTML
          document, styling, and multi-step JS) — embedded rather than
          reimplemented so it stays byte-identical to the delivered file. */}
      <iframe
        src="/intake.html"
        title="Slate Cinema project intake brief"
        className="block w-full h-screen border-0"
      />
    </main>
  )
}
