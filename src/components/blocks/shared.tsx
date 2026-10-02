'use client'

import { ArrowRight, ArrowUpRight } from 'lucide-react'

/*
  Pieces shared by the page-builder section renderers. Styling mirrors the
  hand-built sections (eyebrow with a hairline, bold headline with a grey
  italic ending, light intro text) so a page assembled from blocks reads as
  part of the same site.
*/

export interface BlockHeading {
  eyebrow?: string | null
  headline?: string | null
  headlineAccent?: string | null
  intro?: string | null
}

export function hasHeading(h?: BlockHeading | null): boolean {
  return Boolean(h && (h.eyebrow || h.headline || h.headlineAccent || h.intro))
}

export function SectionHeading({
  heading,
  accent,
  path,
  align = 'left',
  className = 'mb-12',
}: {
  heading?: BlockHeading | null
  accent: string
  /** Click-to-edit path of the heading group, e.g. "layout.2.heading". */
  path?: string
  align?: 'left' | 'center'
  className?: string
}) {
  if (!heading || !hasHeading(heading)) return null
  const field = (name: string) => (path ? `${path}.${name}` : undefined)
  const centered = align === 'center'
  return (
    <div className={`${className} ${centered ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl'}`}>
      {heading.eyebrow && (
        <span
          className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-4"
          style={{ color: accent }}
        >
          <span className="w-8 h-px" style={{ background: `${accent}66` }} />
          <span data-cms-field={field('eyebrow')}>{heading.eyebrow}</span>
          {centered && <span className="w-8 h-px" style={{ background: `${accent}66` }} />}
        </span>
      )}
      {(heading.headline || heading.headlineAccent) && (
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05]">
          <span data-cms-field={field('headline')}>{heading.headline}</span>
          {heading.headlineAccent && (
            <>
              {' '}
              <span data-cms-field={field('headlineAccent')} className="font-serif-accent italic text-white/60">
                {heading.headlineAccent}
              </span>
            </>
          )}
        </h2>
      )}
      {heading.intro && (
        <p
          data-cms-field={field('intro')}
          className={`mt-5 text-white/55 text-base sm:text-lg font-light leading-relaxed ${centered ? 'mx-auto' : ''} max-w-2xl whitespace-pre-line`}
        >
          {heading.intro}
        </p>
      )}
    </div>
  )
}

export function isExternal(href?: string | null): boolean {
  return Boolean(href && /^(https?:)?\/\//.test(href))
}

export interface BlockButton {
  label?: string | null
  href?: string | null
  style?: 'primary' | 'secondary' | null
}

export function BlockButtons({
  buttons,
  accent,
  path,
  className = 'mt-8',
  centered = false,
}: {
  buttons?: BlockButton[] | null
  accent: string
  /** Click-to-edit path of the buttons array, e.g. "layout.2.buttons". */
  path?: string
  className?: string
  centered?: boolean
}) {
  const list = (buttons ?? []).filter((b) => b.label && b.href)
  if (!list.length) return null
  return (
    <div className={`${className} flex flex-wrap items-center gap-3 ${centered ? 'justify-center' : ''}`}>
      {list.map((b, i) => {
        const external = isExternal(b.href)
        const solid = b.style !== 'secondary'
        return (
          <a
            key={`${i}-${b.label}`}
            href={b.href ?? '#'}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            data-cms-field={path ? `${path}.${i}.label` : undefined}
            className={`group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 ${
              solid ? 'text-black' : 'text-white border border-white/25 bg-white/[0.04] hover:border-white/60'
            }`}
            style={solid ? { background: accent, boxShadow: `0 0 28px ${accent}40` } : undefined}
          >
            {b.label}
            {external ? (
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            ) : (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </a>
        )
      })}
    </div>
  )
}

/** Typography for rich text written in /admin (same treatment as journal posts). */
export const proseClasses =
  '[&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-white [&_h2]:mt-12 [&_h2]:mb-5 [&_h2:first-child]:mt-0 ' +
  '[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-10 [&_h3]:mb-4 ' +
  '[&_p]:text-white/65 [&_p]:font-light [&_p]:leading-relaxed [&_p]:mb-6 [&_p]:text-base [&_p]:sm:text-lg ' +
  '[&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-white/30 hover:[&_a]:decoration-white ' +
  '[&_strong]:text-white [&_strong]:font-semibold ' +
  '[&_blockquote]:my-10 [&_blockquote]:pl-6 [&_blockquote]:border-l-2 [&_blockquote]:text-lg [&_blockquote]:sm:text-xl [&_blockquote]:font-light [&_blockquote]:text-white/80 [&_blockquote]:leading-relaxed [&_blockquote]:italic [&_blockquote]:[border-color:var(--block-accent)] ' +
  '[&_ul]:my-6 [&_ul]:space-y-3 [&_ul]:list-none [&_ul]:pl-0 ' +
  '[&_ol]:my-6 [&_ol]:space-y-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-white/65 ' +
  '[&_li]:text-white/65 [&_li]:font-light [&_li]:leading-relaxed ' +
  "[&_ul>li]:pl-5 [&_ul>li]:relative [&_ul>li]:before:content-[''] [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-[0.6em] [&_ul>li]:before:w-1.5 [&_ul>li]:before:h-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:[background:var(--block-accent)]"
