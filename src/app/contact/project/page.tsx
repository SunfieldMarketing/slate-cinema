import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import ProjectIntakeForm from '@/components/ProjectIntakeForm'

export const metadata: Metadata = {
  title: 'Project Intake | Slate Cinema',
  description:
    'Tell us about your project — goals, timeline, and budget — and we’ll follow up with a fixed-price proposal within one business day.',
}

export default function ProjectIntakePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-purple-400 selection:text-white">
      <AmbientBackdrop accent="#c084fc" />

      <div className="relative z-10 w-full">
        <Nav />
        <ProjectIntakeForm />
        <Footer />
      </div>
    </main>
  )
}
