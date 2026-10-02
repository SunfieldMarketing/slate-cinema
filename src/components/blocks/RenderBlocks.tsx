'use client'

import type { ReactNode } from 'react'
import PageHero from '@/components/ui/PageHero'
import CinematicStatement from '@/components/ui/CinematicStatement'
import MidCtaBand from '@/components/MidCtaBand'
import IndustryClientShowcase from '@/components/IndustryClientShowcase'
import IndustryServices from '@/components/IndustryServices'
import IndustryProcess from '@/components/IndustryProcess'
import IndustryFaq from '@/components/IndustryFaq'
import Portfolio from '@/components/Portfolio'
import Pipeline from '@/components/Pipeline'
import FinalCTA from '@/components/FinalCTA'
import GHLBookingWidget from '@/components/GHLBookingWidget'
import { mediaUrl, PLACEHOLDER_IMAGE } from '@/lib/media-url'
import { blockSectionPaths } from '@/lib/cms-paths'
import {
  CardsSection,
  EmbedSection,
  JournalCards,
  LogoStrip,
  MediaSection,
  MediaTextSection,
  SpacerSection,
  StatsSection,
  TextSection,
} from './sections'
import type { BlocksData, ContentBlock } from './types'

/*
  Renders page-builder sections (src/blocks) in the order an editor stacked
  them. Every section honours its own settings: hidden, hidden on phones or
  computers, an anchor id for #links, and an accent color override.

  Sections that already existed as hand-built components (hero, client
  cards, service cards, timeline, FAQ, statement, portfolio grid,
  pipeline, closing CTA, booking calendar) reuse them as-is, so blocks look
  identical to the original pages.
*/

const ANCHOR = /[^a-z0-9-]/g

function lines(text?: string | null): string[] {
  return (text ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

/** Shared wrapper: visibility settings, anchor, and which device sizes show it. */
export function BlockShell({ block, children }: { block: ContentBlock; children: ReactNode }) {
  if (block.hidden) return null
  const anchor = block.anchor?.toLowerCase().trim().replace(/\s+/g, '-').replace(ANCHOR, '') || undefined
  const device = block.hideOn === 'mobile' ? 'hidden md:block' : block.hideOn === 'desktop' ? 'md:hidden' : undefined
  return (
    <div id={anchor} className={device} data-block-type={block.blockType} style={anchor ? { scrollMarginTop: '6rem' } : undefined}>
      {children}
    </div>
  )
}

export function RenderBlock({
  block,
  index,
  accent: pageAccent,
  prefix,
  data,
  isFirst,
}: {
  block: ContentBlock
  index: number
  accent: string
  /** Click-to-edit path of the blocks field, e.g. "layout". */
  prefix: string
  data: BlocksData
  isFirst: boolean
}): ReactNode {
  const accent = block.accent?.trim() || pageAccent
  const path = `${prefix}.${index}`

  switch (block.blockType) {
    case 'hero': {
      const buttons = (block.buttons ?? []).filter((b) => b.label && b.href)
      return (
        <PageHero
          eyebrow={block.eyebrow ?? ''}
          title={lines(block.title)}
          subtitle={block.subtitle ?? undefined}
          videoSrc={mediaUrl(block.video)}
          videoVimeoUrl={block.vimeo ?? undefined}
          posterSrc={mediaUrl(block.image)}
          accent={accent}
          cta={buttons[0] ? { label: buttons[0].label, href: buttons[0].href } : undefined}
          secondaryCta={buttons[1] ? { label: buttons[1].label, href: buttons[1].href } : undefined}
          trustNote={block.trustNote ?? undefined}
          stats={(block.stats ?? []).map((s) => ({ value: s.value, suffix: s.suffix ?? '', label: s.label }))}
          priority={isFirst}
          eyebrowFieldPath={`${path}.eyebrow`}
          titleFieldPaths={lines(block.title).map(() => `${path}.title`)}
          subtitleFieldPath={`${path}.subtitle`}
          ctaFieldPath={`${path}.buttons.0.label`}
          secondaryCtaFieldPath={`${path}.buttons.1.label`}
          trustNoteFieldPath={`${path}.trustNote`}
        />
      )
    }

    case 'richText':
      return <TextSection block={block} accent={accent} path={path} />

    case 'mediaText':
      return <MediaTextSection block={block} accent={accent} path={path} />

    case 'media':
      return <MediaSection block={block} path={path} />

    case 'statement': {
      const statementLines = lines(block.headline)
      if (!statementLines.length) return null
      return (
        <CinematicStatement
          eyebrow={block.eyebrow ?? ''}
          lines={statementLines}
          body={block.body ?? ''}
          videoSrc={block.video ?? ''}
          accent={accent}
          fieldPaths={{ eyebrow: `${path}.eyebrow`, lines: `${path}.headline`, body: `${path}.body` }}
        />
      )
    }

    case 'ctaBand':
      return (
        <MidCtaBand
          accent={accent}
          cta={{
            headline: block.headline ?? '',
            subhead: block.subhead ?? '',
            buttonLabel: block.buttonLabel ?? '',
            buttonHref: block.buttonHref || '/contact',
          }}
          paths={{ headline: `${path}.headline`, subhead: `${path}.subhead`, button: `${path}.buttonLabel` }}
        />
      )

    case 'cards':
      return <CardsSection block={block} accent={accent} path={path} />

    case 'stats':
      return <StatsSection block={block} accent={accent} path={path} />

    case 'clientCards':
      return (
        <IndustryClientShowcase
          accent={accent}
          heading={{
            eyebrow: block.heading?.eyebrow ?? '',
            headline: block.heading?.headline ?? '',
            accent: block.heading?.headlineAccent ?? '',
            intro: block.heading?.intro ?? '',
          }}
          clients={(block.clients ?? []).map((c) => ({
            name: c.name,
            year: c.year ?? '',
            description: c.description ?? '',
            vimeo: c.vimeoId ?? '',
            orientation: c.orientation ?? 'landscape',
          }))}
          paths={blockSectionPaths(path, 'clients')}
        />
      )

    case 'serviceCards': {
      const cards = (block.cards ?? []).map((c) => ({
        title: c.title,
        description: c.description,
        outcome: c.outcome ?? '',
        deliverables: (c.deliverables ?? []).map((d) => d.item),
        meta: c.meta ?? '',
        image: mediaUrl(c.image) || PLACEHOLDER_IMAGE,
        video: mediaUrl(c.video),
        videoVimeoUrl: c.videoVimeoUrl ?? undefined,
        featured: c.featured ?? false,
      }))
      if (!cards.length) return null
      return (
        <IndustryServices
          accent={accent}
          services={cards}
          heading={{
            eyebrow: block.heading?.eyebrow ?? '',
            headline: block.heading?.headline ?? '',
            accent: block.heading?.headlineAccent ?? '',
            intro: block.heading?.intro ?? '',
          }}
          paths={blockSectionPaths(path, 'cards')}
        />
      )
    }

    case 'timeline': {
      const steps = (block.steps ?? []).map((s) => ({ week: s.week, title: s.title, body: s.body }))
      if (!steps.length) return null
      return (
        <IndustryProcess
          accent={accent}
          steps={steps}
          heading={{
            eyebrow: block.heading?.eyebrow ?? '',
            headline: block.heading?.headline ?? '',
            accent: block.heading?.headlineAccent ?? '',
            intro: block.heading?.intro ?? '',
          }}
          paths={blockSectionPaths(path, 'steps')}
        />
      )
    }

    case 'faq':
      return (
        <IndustryFaq
          accent={accent}
          faqs={(block.items ?? []).map((f) => ({ question: f.question, answer: f.answer }))}
          heading={{
            eyebrow: block.heading?.eyebrow ?? '',
            headline: block.heading?.headline ?? '',
            accent: block.heading?.headlineAccent ?? '',
            intro: block.heading?.intro ?? '',
          }}
          aside={{
            title: block.aside?.title ?? '',
            body: block.aside?.body ?? '',
            buttonLabel: block.aside?.buttonLabel ?? '',
            buttonHref: block.aside?.buttonHref ?? '/contact',
            note: block.aside?.note ?? '',
          }}
          paths={blockSectionPaths(path, 'items')}
          asidePath={`${path}.aside`}
        />
      )

    case 'logos':
      return <LogoStrip block={block} accent={accent} path={path} />

    case 'portfolioGrid': {
      const all = data.projects ?? []
      const limit = Math.max(1, block.limit ?? 8)
      let projects = all
      if (block.source === 'category' && block.category?.trim()) {
        const wanted = block.category.trim().toLowerCase()
        projects = all.filter((p) => p.category.toLowerCase() === wanted)
      } else if (block.source === 'manual') {
        const ids = (block.projects ?? []).map((p) => String(typeof p === 'object' && p ? p.id : p))
        projects = ids.map((id) => all.find((p) => p.id === id)).filter((p): p is (typeof all)[number] => Boolean(p))
      }
      projects = projects.slice(0, limit)
      if (!projects.length) return null
      return (
        <Portfolio
          projects={projects}
          heading={{ eyebrow: block.heading?.eyebrow ?? '', headline: block.heading?.headline ?? '' }}
          headingFieldPaths={{ eyebrow: `${path}.heading.eyebrow`, headline: `${path}.heading.headline` }}
        />
      )
    }

    case 'journalPosts':
      return <JournalCards block={block} accent={accent} path={path} posts={data.posts ?? []} readLabel={data.readLabel} />

    case 'pipeline': {
      const pipeline = data.pipeline
      if (!pipeline?.categories.length) return null
      // The phases live in the Pipeline global, so clicks inside them open
      // that document; this block only overrides the heading.
      return (
        <div data-cms-global="pipeline">
          <Pipeline
            categories={pipeline.categories}
            heading={{
              eyebrow: block.eyebrow || pipeline.heading?.eyebrow,
              title: block.title || pipeline.heading?.title,
              description: block.description || pipeline.heading?.description,
            }}
          />
        </div>
      )
    }

    case 'finalCta':
      return (
        <div data-cms-global="final-cta">
          <FinalCTA data={data.finalCta ?? null} />
        </div>
      )

    case 'booking':
      return (
        <GHLBookingWidget
          copy={{
            eyebrow: block.eyebrow,
            headline: block.headline,
            sessionLabel: block.sessionLabel,
            durationLabel: block.durationLabel,
          }}
          cms={{ prefix: path }}
        />
      )

    case 'embed':
      return <EmbedSection block={block} accent={accent} path={path} />

    case 'spacer':
      return <SpacerSection block={block} />

    default:
      return null
  }
}

export default function RenderBlocks({
  blocks,
  accent,
  prefix = 'layout',
  data = {},
}: {
  blocks: ContentBlock[] | null | undefined
  accent: string
  prefix?: string
  data?: BlocksData
}) {
  const list = blocks ?? []
  const firstVisible = list.findIndex((b) => !b.hidden)
  return (
    <>
      {list.map((block, index) => (
        <BlockShell key={block.id ?? `${block.blockType}-${index}`} block={block}>
          <RenderBlock block={block} index={index} accent={accent} prefix={prefix} data={data} isFirst={index === firstVisible} />
        </BlockShell>
      ))}
    </>
  )
}
