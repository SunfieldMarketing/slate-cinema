'use client'

import { useEffect } from 'react'
import { ArrowRight, X } from 'lucide-react'
import type { PortfolioProject } from '@/lib/portfolio-projects'

/*
  ProjectCardModal — the breakdown card opened by clicking a frame on the
  film reel: featured cut up top (poster image stands in wherever video
  can't render), then the project story and its metrics, closed by
  backdrop click, the X, or Escape.
*/
export default function ProjectCardModal({
  project,
  accent,
  onClose,
}: {
  project: PortfolioProject | null
  accent: string
  onClose: () => void
}) {
  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} project details`}
    >
      <button
        type="button"
        aria-label="Close project details"
        onClick={onClose}
        className="absolute inset-0 bg-ink/85 backdrop-blur-md cursor-default"
      />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/12 bg-[#0a0f18] shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full border border-white/15 bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-colors hover:border-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Featured cut */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-3xl bg-black">
          <img src={project.url} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
          {project.video && (
            <video
              src={project.video}
              poster={project.url}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <span
            className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full backdrop-blur-md border text-white pointer-events-none"
            style={{ borderColor: `${accent}55`, backgroundColor: 'rgba(5,7,12,0.7)' }}
          >
            {project.category}
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6 flex-wrap mb-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{project.title}</h3>
              <div className="mt-1.5 font-mono text-[11px] tracking-[0.18em] uppercase text-white/55">{project.company}</div>
            </div>
          </div>

          <p className="text-sm sm:text-base text-white/65 font-light leading-relaxed mb-7 max-w-xl">{project.copy}</p>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {project.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
                <div className="text-xl font-bold tracking-tight" style={{ color: accent }}>{m.value}</div>
                <div className="mt-0.5 font-mono text-[9px] tracking-[0.18em] uppercase text-white/55">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-black transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              style={{ background: accent, boxShadow: `0 0 28px ${accent}50` }}
            >
              Start a project like this <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-white/60 hover:text-white transition-colors px-2 py-2 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            >
              Back to the reel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
