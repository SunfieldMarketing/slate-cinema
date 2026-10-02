'use client'

import type { CSSProperties } from 'react'
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import SmartVideo from '@/components/ui/SmartVideo'
import StatsBand from '@/components/ui/StatsBand'
import { Marquee } from '@/components/ui/marquee'
import { mediaUrl } from '@/lib/media-url'
import { resolveIcon } from '@/lib/icon-map'
import { extractVimeoId } from '@/lib/vimeo'
import type { JournalPostLocal } from '@/lib/normalize'
import { BlockButtons, isExternal, proseClasses, SectionHeading } from './shared'
import type { BlockOfType } from './types'

/*
  Page-builder sections that had no hand-built equivalent on the site.
  Each takes its block's data, the accent color to use and its
  click-to-edit path prefix ("layout.<n>"). The sections that reuse
  existing components are wired up in RenderBlocks.tsx.
*/

const accentVar = (accent: string) => ({ ['--block-accent' as string]: accent }) as CSSProperties

const ASPECT: Record<string, string> = {
  landscape: 'aspect-video',
  portrait: 'aspect-[9/16] max-w-sm mx-auto w-full',
  feed: 'aspect-[4/5] max-w-md mx-auto w-full',
  square: 'aspect-square max-w-xl mx-auto w-full',
  cinema: 'aspect-[21/9]',
}

/** An image, a looping video, or a click-to-play player in a framed box. */
function MediaFrame({
  image,
  video,
  vimeo,
  aspect,
  playback = 'ambient',
  rounded = true,
  alt = '',
  path,
}: {
  image?: unknown
  video?: unknown
  vimeo?: string | null
  aspect: string
  playback?: string | null
  rounded?: boolean
  alt?: string
  path: string
}) {
  const imageSrc = mediaUrl(image)
  const videoSrc = mediaUrl(video)
  const hasVideo = Boolean(extractVimeoId(vimeo) || videoSrc)
  if (!imageSrc && !hasVideo) return null
  return (
    <div
      data-cms-field={hasVideo && vimeo ? `${path}.vimeo` : hasVideo ? `${path}.video` : `${path}.image`}
      className={`relative overflow-hidden bg-ink-raised ${rounded ? 'rounded-2xl border border-white/10' : ''} ${ASPECT[aspect] ?? ASPECT.landscape}`}
    >
      {hasVideo ? (
        <SmartVideo
          src={videoSrc}
          vimeo={vimeo ?? undefined}
          poster={imageSrc}
          variant={playback === 'player' ? 'player' : 'background'}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- plain <img> like every other image on the site (see TrustSection.tsx)
        <img src={imageSrc} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      )}
    </div>
  )
}

export function TextSection({ block, accent, path }: { block: BlockOfType<'richText'>; accent: string; path: string }) {
  const width = block.width === 'narrow' ? 'max-w-2xl' : block.width === 'wide' ? 'max-w-6xl' : 'max-w-4xl'
  const centered = block.align === 'center'
  return (
    <section className="relative w-full py-16 md:py-20">
      <div className={`relative z-10 w-full ${width} mx-auto px-5 sm:px-8 ${centered ? 'text-center' : ''}`}>
        <SectionHeading heading={block.heading} accent={accent} path={`${path}.heading`} align={centered ? 'center' : 'left'} className="mb-8" />
        {block.content && (
          <div data-cms-field={`${path}.content`} className={proseClasses} style={accentVar(accent)}>
            <RichText data={block.content as Parameters<typeof RichText>[0]['data']} />
          </div>
        )}
      </div>
    </section>
  )
}

export function MediaTextSection({ block, accent, path }: { block: BlockOfType<'mediaText'>; accent: string; path: string }) {
  const mediaRight = block.mediaPosition === 'right'
  return (
    <section className="relative w-full py-16 md:py-24">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className={mediaRight ? 'md:order-2' : ''}>
          <MediaFrame
            image={block.image}
            video={block.video}
            vimeo={block.vimeo}
            aspect={block.aspect ?? 'landscape'}
            alt={block.heading?.headline ?? ''}
            path={path}
          />
        </div>
        <div>
          <SectionHeading heading={block.heading} accent={accent} path={`${path}.heading`} className="mb-6" />
          {block.content && (
            <div data-cms-field={`${path}.content`} className={proseClasses} style={accentVar(accent)}>
              <RichText data={block.content as Parameters<typeof RichText>[0]['data']} />
            </div>
          )}
          <BlockButtons buttons={block.buttons} accent={accent} path={`${path}.buttons`} className="mt-2" />
        </div>
      </div>
    </section>
  )
}

export function MediaSection({ block, path }: { block: BlockOfType<'media'>; path: string }) {
  const size = block.size ?? 'contained'
  const container = size === 'full' ? 'w-full' : size === 'wide' ? 'w-full max-w-7xl mx-auto px-5 sm:px-8' : 'w-full max-w-5xl mx-auto px-5 sm:px-8'
  return (
    <section className={`relative w-full ${size === 'full' ? 'py-0' : 'py-12 md:py-16'}`}>
      <figure className={container}>
        <MediaFrame
          image={block.image}
          video={block.video}
          vimeo={block.vimeo}
          aspect={block.aspect ?? 'landscape'}
          playback={block.playback}
          rounded={size !== 'full'}
          alt={block.caption ?? ''}
          path={path}
        />
        {block.caption && (
          <figcaption
            data-cms-field={`${path}.caption`}
            className={`mt-4 font-mono text-[10px] tracking-[0.2em] uppercase text-white/45 ${size === 'full' ? 'px-5 sm:px-8' : ''}`}
          >
            {block.caption}
          </figcaption>
        )}
      </figure>
    </section>
  )
}

const COLUMNS: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

export function CardsSection({ block, accent, path }: { block: BlockOfType<'cards'>; accent: string; path: string }) {
  const cards = block.cards ?? []
  if (!cards.length) return null
  return (
    <section className="relative w-full py-16 md:py-24">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <SectionHeading heading={block.heading} accent={accent} path={`${path}.heading`} />
        <div className={`grid grid-cols-1 gap-5 ${COLUMNS[block.columns ?? '3'] ?? COLUMNS['3']}`}>
          {cards.map((c, i) => {
            const Icon = c.icon ? resolveIcon(c.icon) : null
            const image = mediaUrl(c.image)
            const external = isExternal(c.linkHref)
            return (
              <div
                key={c.id ?? i}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col transition-colors duration-300 hover:border-white/20"
              >
                {image && (
                  <div className="relative aspect-video overflow-hidden" data-cms-field={`${path}.cards.${i}.image`}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- same plain <img> convention as the rest of the site */}
                    <img src={image} alt={c.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  {Icon && (
                    <div
                      className="w-11 h-11 rounded-xl border flex items-center justify-center mb-5"
                      style={{ borderColor: `${accent}40`, background: `${accent}14` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: accent }} />
                    </div>
                  )}
                  <h3 data-cms-field={`${path}.cards.${i}.title`} className="text-lg font-semibold text-white mb-2">
                    {c.title}
                  </h3>
                  {c.text && (
                    <p data-cms-field={`${path}.cards.${i}.text`} className="text-sm text-white/55 font-light leading-relaxed whitespace-pre-line flex-1">
                      {c.text}
                    </p>
                  )}
                  {c.linkLabel && c.linkHref && (
                    <a
                      href={c.linkHref}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      data-cms-field={`${path}.cards.${i}.linkLabel`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all"
                    >
                      {c.linkLabel}
                      {external ? <ArrowUpRight className="w-4 h-4" style={{ color: accent }} /> : <ArrowRight className="w-4 h-4" style={{ color: accent }} />}
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function StatsSection({ block, accent, path }: { block: BlockOfType<'stats'>; accent: string; path: string }) {
  const stats = (block.stats ?? []).map((s) => ({ value: s.value, suffix: s.suffix ?? '', label: s.label }))
  if (!stats.length) return null
  return (
    <div className="relative w-full">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-16 md:pt-20 -mb-8">
        <SectionHeading heading={block.heading} accent={accent} path={`${path}.heading`} align="center" className="mb-0" />
      </div>
      <StatsBand stats={stats} fieldPathPrefix={`${path}.stats`} />
    </div>
  )
}

export function LogoStrip({ block, accent, path }: { block: BlockOfType<'logos'>; accent: string; path: string }) {
  const logos = (block.logos ?? [])
    .map((l) => ({ name: l.name, src: mediaUrl(l.logo) }))
    .filter((l): l is { name: string; src: string } => Boolean(l.src))
  if (!logos.length) return null
  return (
    <section className="relative w-full py-10 overflow-hidden">
      {(block.ratingText || block.label) && (
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-5">
          {block.ratingText && (
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5" fill={accent} stroke={accent} />
                ))}
              </div>
              <span data-cms-field={`${path}.ratingText`} className="font-mono text-[11px] text-white/50 tracking-wide">
                {block.ratingText}
              </span>
            </div>
          )}
          {block.ratingText && block.label && <div className="hidden sm:block w-px h-4 bg-white/15" />}
          {block.label && (
            <span data-cms-field={`${path}.label`} className="font-mono text-[10px] tracking-[0.3em] text-white/35 uppercase">
              {block.label}
            </span>
          )}
        </div>
      )}
      <div className="[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <Marquee pauseOnHover className="[--duration:38s] [--gap:4rem]">
          {logos.map((l, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- same plain <img> convention as TrustBanner.tsx
            <img
              key={`${l.src}-${i}`}
              src={l.src}
              alt={l.name}
              className="h-10 sm:h-14 w-auto shrink-0 grayscale opacity-90 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
            />
          ))}
        </Marquee>
      </div>
    </section>
  )
}

export function JournalCards({
  block,
  accent,
  path,
  posts,
  readLabel = 'Read the piece',
}: {
  block: BlockOfType<'journalPosts'>
  accent: string
  path: string
  posts: JournalPostLocal[]
  readLabel?: string
}) {
  const category = block.category?.trim().toLowerCase()
  const list = posts.filter((p) => !category || p.category.toLowerCase() === category).slice(0, Math.max(1, block.limit ?? 3))
  if (!list.length) return null
  return (
    <section className="relative w-full py-16 md:py-24">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <SectionHeading heading={block.heading} accent={accent} path={`${path}.heading`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => (
            <a
              key={p.slug}
              href={`/journal/${p.slug}`}
              data-cms-collection="journal-posts"
              data-cms-doc-id={p.id}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-white/25 transition-colors duration-500 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element -- same plain <img> convention as JournalPageContent.tsx */}
                <img
                  src={p.coverImage}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <span
                  data-cms-field="category"
                  className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15"
                  style={{ color: p.accent }}
                >
                  {p.category}
                </span>
              </div>
              <div className="flex-1 flex flex-col p-6">
                <div className="flex items-center gap-3 font-mono text-[10px] tracking-widest text-white/40 uppercase mb-3">
                  <span>{p.date}</span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span>{p.readTime}</span>
                </div>
                <h3 data-cms-field="title" className="text-white font-bold text-lg leading-snug mb-2 transition-colors group-hover:text-white/80">
                  {p.title}
                </h3>
                <p className="text-white/50 text-sm font-light leading-relaxed line-clamp-3 flex-1">{p.excerpt}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                  {readLabel}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EmbedSection({ block, accent, path }: { block: BlockOfType<'embed'>; accent: string; path: string }) {
  const url = block.url?.trim()
  const safeUrl = url && /^https:\/\//i.test(url) ? url : undefined
  const html = block.html?.trim()
  if (!safeUrl && !html) return null
  const height = Math.min(Math.max(block.height ?? 600, 120), 3000)
  return (
    <section className="relative w-full py-16 md:py-20">
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8">
        <SectionHeading heading={block.heading} accent={accent} path={`${path}.heading`} />
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-2 sm:p-3 overflow-hidden">
          {safeUrl ? (
            <iframe
              src={safeUrl}
              title={block.heading?.headline || 'Embedded content'}
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; geolocation"
              allowFullScreen
              className="block w-full rounded-xl border-0"
              style={{ height }}
            />
          ) : (
            // Pasted embed code runs in its own sandbox with no access to
            // this site's pages or cookies (no allow-same-origin).
            <iframe
              srcDoc={html}
              title={block.heading?.headline || 'Embedded content'}
              sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              loading="lazy"
              className="block w-full rounded-xl border-0 bg-white"
              style={{ height }}
            />
          )}
        </div>
      </div>
    </section>
  )
}

const SPACE: Record<string, string> = { sm: 'h-8', md: 'h-16', lg: 'h-28' }

export function SpacerSection({ block }: { block: BlockOfType<'spacer'> }) {
  return (
    <div className={`relative w-full flex items-center ${SPACE[block.size ?? 'md'] ?? SPACE.md}`} aria-hidden>
      {block.divider && <div className="w-full max-w-6xl mx-auto px-5 sm:px-8"><div className="h-px bg-white/10" /></div>}
    </div>
  )
}
