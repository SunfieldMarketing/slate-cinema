/*
  Converts Payload's generated doc shapes (media as relation objects,
  icons as string keys, sub-arrays wrapped for Payload's array-field
  requirements) back into the exact plain shapes the site's existing
  presentational components already expect (IndustryData,
  PortfolioProjectLocal, JournalPostLocal — the same interfaces that
  used to live in src/lib/industries.ts, portfolio-projects.ts,
  journal.ts).

  Doing the shape-normalization once here means every leaf component
  (IndustryServices, IndustryProcess, IndustryFaq,
  IndustryVideoTestimonials, Portfolio, ProjectCardModal, etc.) needed
  ZERO changes for the CMS migration -- they still just receive plain
  strings/arrays like before.
*/
import type { Industry, PortfolioProject as PayloadPortfolioProject, JournalPost as PayloadJournalPost, Pipeline as PayloadPipeline } from '@/payload-types'
import {
  mediaUrl,
  mediaUrlOrPlaceholder,
  getIndustriesCollection,
  getPortfolioProjectsCollection,
  getJournalPostsCollection,
} from '@/lib/payload-data'
import type { Category as PipelineCategory } from '@/lib/pipeline-data'
import { categories as defaultPipelineCategories } from '@/lib/pipeline-data'
import { industries as staticIndustries, type IndustryData as StaticIndustryData } from '@/lib/industries'
import { extractVimeoId } from '@/lib/vimeo'
import { PLACEHOLDER_IMAGE } from '@/lib/media-url'

/*
  IMPORTANT: `icon` stays a plain string key (e.g. "Film"), never
  resolved to an actual component here. This data crosses the server ->
  client boundary (Server Component fetches it, passes it as a prop or
  Context value into a 'use client' component) -- React Server
  Components can only serialize plain JSON-shaped data across that
  boundary, and a resolved LucideIcon is a function reference, which
  breaks with "Functions cannot be passed directly to Client
  Components." Resolve via resolveIcon() from '@/lib/icon-map' inside
  whichever client component actually renders it.
*/

export interface IndustryStat {
  value: number
  suffix: string
  label: string
}
export interface IndustryServiceCard {
  title: string
  description: string
  outcome: string
  deliverables: string[]
  meta: string
  image: string
  video?: string
  /** Vimeo URL/ID -- takes priority over `video` when set. See SmartVideo. */
  videoVimeoUrl?: string
  featured?: boolean
}
export interface IndustryVideoTestimonial {
  quote: string
  name: string
  role: string
  company: string
  video: string
  /** Vimeo URL/ID -- takes priority over `video` when set. See SmartVideo. */
  videoVimeoUrl?: string
  outcome: string
  poster?: string
  logo?: string
}
export interface IndustryProcessStep {
  week: string
  title: string
  body: string
}
export interface IndustryFaqItem {
  question: string
  answer: string
}
/** A client video card in the strip under the logo banner. */
export interface IndustryClientCard {
  name: string
  year: string
  description: string
  /** Vimeo URL or ID. Cards without one are not shown. */
  vimeo: string
  /** The video's shape, so its card frames it without black bars. */
  orientation: 'landscape' | 'portrait' | 'feed' | 'square'
}
/** Eyebrow + headline (+ an italic grey ending) over a page section. An
    empty string means the editor cleared it: hide that element. */
export interface IndustrySectionHeading {
  eyebrow: string
  headline: string
  accent: string
  /** Optional paragraph under the headline (page-builder blocks). */
  intro?: string
}
export interface IndustryStatement {
  eyebrow: string
  lines: string[]
  body: string
  /** Vimeo URL/ID or a video file URL. */
  video: string
}
export interface IndustryCta {
  headline: string
  subhead: string
  buttonLabel: string
  buttonHref: string
}
/** Set when the whole page should hand visitors off to a sister brand
    (Healthcare -> Wavecare). */
export interface IndustryRedirect {
  eyebrow: string
  headline: string
  body: string
  buttonLabel: string
  url: string
}
export interface IndustryData {
  id: string
  slug: string
  label: string
  icon: string
  accent: string
  blurb: string
  description: string
  stat: string
  heroImage: string
  heroVideo: string
  /** Vimeo URL/ID -- takes priority over `heroVideo` when set. See SmartVideo. */
  heroVideoVimeoUrl?: string
  gallery: string[]
  stats: IndustryStat[]
  services: string[]
  testimonial?: { quote: string; name: string; role: string; company: string }
  serviceCards?: IndustryServiceCard[]
  videoTestimonials?: IndustryVideoTestimonial[]
  process?: IndustryProcessStep[]
  faqs?: IndustryFaqItem[]
  /** Position in the Portfolio menu and the /portfolio wheel. */
  order: number
  clientsHeading: IndustrySectionHeading
  clients: IndustryClientCard[]
  servicesHeading: IndustrySectionHeading
  statement?: IndustryStatement
  cta: IndustryCta
  processHeading: IndustrySectionHeading
  galleryHeading: { eyebrow: string; headline: string }
  redirect?: IndustryRedirect
  /** The page's Sections list (order/visibility + library sections), as
      saved in /admin. Absent for a code-only industry and in the copy the
      root layout hands every page (see layout.tsx). */
  layout?: Industry['layout']
}

/*
  Copy for an industry that only exists in src/lib/industries.ts (no CMS
  doc yet -- e.g. a fresh local database). A CMS doc never falls back to
  these: its fields are seeded with this same copy (field defaults + the
  20261001 migration), so an empty value there means an editor cleared it
  and the element should disappear.
*/
const STATIC_DEFAULTS = {
  clientsHeading: { eyebrow: 'Who We Shoot For', headline: '', accent: '' },
  servicesHeading: { eyebrow: 'What We Make', headline: 'Ways it shows up', accent: '— pick yours.' },
  processHeading: { eyebrow: 'How It Works', headline: 'The timeline,', accent: 'concept to distribution.' },
  galleryHeading: { eyebrow: 'Our Work', headline: 'A Gallery of Impact' },
  cta: {
    headline: 'Have a project like this in mind?',
    subhead: '20 minutes, no pitch deck — just an honest read on scope, timeline and budget.',
    buttonLabel: 'Get Started',
    buttonHref: '/contact',
  },
}
const STATIC_REDIRECTS: Record<string, IndustryRedirect> = {
  healthcare: {
    eyebrow: 'Sister Brand',
    headline: 'Want to see what our healthcare marketing does?',
    body: 'We operate under Wavecare, our sister brand.',
    buttonLabel: 'Visit Wavecare',
    url: 'https://wavecare.io',
  },
}

function statementLines(headline: string | null | undefined): string[] {
  return (headline ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

export function normalizeIndustry(doc: Industry): IndustryData {
  // A doc whose slug also exists in src/lib/industries.ts (Podcasts, moved
  // into the CMS 2026-10-01 without uploading its media) borrows that
  // entry's files for any media slot that's still empty, so it looks
  // exactly as it did before. Uploading media in /admin overrides this.
  const codeEntry = staticIndustries.find((i) => i.slug === doc.slug)
  const lines = statementLines(doc.statementHeadline)
  return {
    id: String(doc.id),
    slug: doc.slug,
    label: doc.label,
    icon: doc.icon,
    accent: doc.accent,
    blurb: doc.blurb,
    description: doc.description,
    stat: doc.stat,
    heroImage: mediaUrl(doc.heroImage) || codeEntry?.heroImage || PLACEHOLDER_IMAGE,
    heroVideo: mediaUrl(doc.heroVideo) || (doc.heroVideoVimeoUrl ? '' : codeEntry?.heroVideo) || '',
    // Re-enabled 2026-08-22 -- heroVideoVimeoUrl is a real column now
    // (see src/migrations/).
    heroVideoVimeoUrl: doc.heroVideoVimeoUrl ?? undefined,
    gallery: doc.gallery?.length
      ? doc.gallery.map((g) => mediaUrlOrPlaceholder(g.image))
      : (codeEntry?.gallery ?? []),
    stats: (doc.stats ?? []).map((s) => ({ value: s.value, suffix: s.suffix || '', label: s.label })),
    services: (doc.services ?? []).map((s) => s.name),
    // Only surface a testimonial when every field is actually filled in —
    // the group is now fully optional in Payload (2026-08-12, fabricated
    // placeholder quotes removed), so a doc can have an empty/partial group.
    testimonial:
      doc.testimonial?.quote && doc.testimonial.name && doc.testimonial.role && doc.testimonial.company
        ? {
            quote: doc.testimonial.quote,
            name: doc.testimonial.name,
            role: doc.testimonial.role,
            company: doc.testimonial.company,
          }
        : undefined,
    serviceCards: (doc.serviceCards ?? []).map((sc) => ({
      title: sc.title,
      description: sc.description,
      outcome: sc.outcome,
      deliverables: (sc.deliverables ?? []).map((d) => d.item),
      meta: sc.meta || '',
      image:
        mediaUrl(sc.image) ||
        codeEntry?.serviceCards?.find((c) => c.title === sc.title)?.image ||
        PLACEHOLDER_IMAGE,
      video: mediaUrl(sc.video),
      videoVimeoUrl: sc.videoVimeoUrl ?? undefined,
      featured: sc.featured ?? false,
    })),
    videoTestimonials: (doc.videoTestimonials ?? []).map((vt) => ({
      quote: vt.quote,
      name: vt.name,
      role: vt.role,
      company: vt.company,
      video: mediaUrl(vt.video) || '',
      videoVimeoUrl: vt.videoVimeoUrl ?? undefined,
      outcome: vt.outcome,
      poster: mediaUrlOrPlaceholder(vt.poster),
      logo: mediaUrl(vt.logo),
    })),
    process: (doc.process ?? []).map((p) => ({ week: p.week, title: p.title, body: p.body })),
    faqs: (doc.faqs ?? []).map((f) => ({ question: f.question, answer: f.answer })),
    // Everything below was typed into the page templates or lived only in
    // src/lib/industries.ts until 2026-10-01 -- see Industries.ts.
    order: doc.order ?? 100,
    clientsHeading: {
      eyebrow: doc.sectionEyebrow ?? '',
      headline: doc.sectionHeadline ?? '',
      accent: doc.sectionHeadlineAccent ?? '',
    },
    clients: (doc.clients ?? []).filter(Boolean).map((c) => ({
      name: c.name,
      year: c.year ?? '',
      description: c.description ?? '',
      vimeo: c.vimeoId ?? '',
      orientation: c.orientation ?? 'landscape',
    })),
    servicesHeading: {
      eyebrow: doc.servicesEyebrow ?? '',
      headline: doc.servicesHeadline ?? '',
      accent: doc.servicesHeadlineAccent ?? '',
    },
    statement: lines.length
      ? {
          eyebrow: doc.statementEyebrow ?? '',
          lines,
          body: doc.statementBody ?? '',
          video: doc.statementVideo ?? '',
        }
      : undefined,
    cta: {
      headline: doc.ctaHeadline ?? '',
      subhead: doc.ctaSubhead ?? '',
      buttonLabel: doc.ctaButtonLabel ?? '',
      buttonHref: doc.ctaButtonHref || '/contact',
    },
    processHeading: {
      eyebrow: doc.processEyebrow ?? '',
      headline: doc.processHeadline ?? '',
      accent: doc.processHeadlineAccent ?? '',
    },
    galleryHeading: { eyebrow: doc.galleryEyebrow ?? '', headline: doc.galleryHeadline ?? '' },
    redirect: doc.redirectEnabled
      ? {
          eyebrow: doc.redirectEyebrow ?? '',
          headline: doc.redirectHeadline ?? '',
          body: doc.redirectBody ?? '',
          buttonLabel: doc.redirectButtonLabel ?? '',
          url: doc.redirectUrl ?? '',
        }
      : undefined,
    layout: doc.layout ?? undefined,
  }
}

export interface PortfolioProjectLocal {
  /** Real Payload document id, stringified -- see the matching comment on
      IndustryData.id. Used by the click-to-edit shortcut to confirm a
      click belongs to the doc currently open in the admin edit view. */
  id: string
  title: string
  category: string
  company: string
  url: string
  copy: string
  metrics: { label: string; value: string }[]
  video?: string
  /** Vimeo URL/ID -- takes priority over `video` when set. See SmartVideo. */
  videoVimeoUrl?: string
}

export function normalizePortfolioProject(doc: PayloadPortfolioProject): PortfolioProjectLocal {
  return {
    id: String(doc.id),
    title: doc.title,
    category: doc.category,
    company: doc.company,
    url: mediaUrlOrPlaceholder(doc.poster),
    copy: doc.copy,
    metrics: (doc.metrics ?? []).map((m) => ({ label: m.label, value: m.value })),
    video: mediaUrl(doc.video),
    // Re-enabled 2026-08-19 -- videoVimeoUrl is a real column now (see
    // src/migrations/), unlike when this was first disabled.
    videoVimeoUrl: doc.videoVimeoUrl ?? undefined,
  }
}

export interface JournalPostLocal {
  /** Real Payload document id, stringified -- see the matching comment on
      IndustryData.id. Used by the click-to-edit shortcut to confirm a
      click belongs to the doc currently open in the admin edit view. */
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  accent: string
  date: string
  readTime: string
  coverImage: string
  author: string
  content: PayloadJournalPost['content']
}

export function normalizeJournalPost(doc: PayloadJournalPost): JournalPostLocal {
  return {
    id: String(doc.id),
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    category: doc.category,
    accent: doc.accent,
    date: doc.date,
    readTime: doc.readTime,
    coverImage: mediaUrlOrPlaceholder(doc.coverImage),
    author: doc.author,
    content: doc.content,
  }
}

/* The Production Pipeline categories -- shared between Home and How It
   Works. Payload's array-field requirements wrap `tags` as `{tag}[]`
   objects and `id` as `categoryId`; unwrap back to the plain shape
   Pipeline.tsx already expects (src/lib/pipeline-data.ts's Category). */
export function normalizePipeline(doc: PayloadPipeline | null): PipelineCategory[] {
  // An empty CMS list (a fresh/local database, or every phase deleted in
  // /admin) used to render the section as a bare heading with nothing under
  // it. Fall back to the built-in phases -- same text as the published CMS
  // content -- with the same S3 clips production uses.
  if (!doc?.categories?.filter(Boolean).length) {
    return defaultPipelineCategories.map((c) => ({
      ...c,
      video: `https://s3.us-east-1.amazonaws.com/slate-cinema-media/slate/pipeline-${c.id}.mp4`,
    }))
  }
  // Filter(Boolean) before mapping, both here and on the nested services
  // array -- guards against a sparse/malformed array (a hole, or a row
  // Payload returns as null/undefined) crashing the whole page render with
  // "Cannot read properties of undefined (reading 'name')" instead of just
  // dropping the one bad entry. Seen for real 2026-08-20 during the
  // drafts/versions migration rollout on a live category's services list.
  return (doc?.categories ?? []).filter(Boolean).map((c) => ({
    id: c.categoryId,
    title: c.title,
    video: mediaUrl(c.video) || '',
    // Re-enabled 2026-08-22 -- videoVimeoUrl is a real column now (see
    // src/migrations/).
    videoVimeoUrl: c.videoVimeoUrl ?? undefined,
    color: c.color,
    services: (c.services ?? [])
      .filter(Boolean)
      .map((s) => ({
        name: s.name,
        desc: s.desc || undefined,
        tags: s.tags?.length ? s.tags.map((t) => t.tag) : undefined,
      })),
  }))
}

/*
  Converts a src/lib/industries.ts entry (the pre-CMS static shape,
  `icon` as an actual LucideIcon component) into this file's IndustryData
  shape (`icon` as a plain string key) -- the same "component -> string
  key" convention Payload's `icon` select field already uses site-wide
  (see ICON_OPTIONS in src/collections/Industries.ts), so resolveIcon()
  on the frontend works identically regardless of which source the
  industry came from. Relies on lucide-react setting `.displayName` to
  the exported icon name (e.g. `Mic.displayName === 'Mic'`), which every
  lucide-react icon component does.
*/
function staticToNormalized(industry: StaticIndustryData, index: number): IndustryData {
  const iconName = (industry.icon as unknown as { displayName?: string }).displayName || 'Film'
  const { clientShowcase, cinematicStatement, ...rest } = industry
  const cardCount = industry.serviceCards?.length ?? 0
  return {
    ...rest,
    icon: iconName,
    order: 1000 + index,
    clientsHeading: STATIC_DEFAULTS.clientsHeading,
    // Same rule as the CMS: only cards with a real Vimeo video show.
    clients: (clientShowcase ?? []).map((c) => ({
      name: c.name,
      year: c.year,
      description: c.body,
      vimeo: extractVimeoId(c.video) ? c.video : '',
      orientation: 'landscape' as const,
    })),
    servicesHeading: {
      ...STATIC_DEFAULTS.servicesHeading,
      headline: servicesHeadlineFor(cardCount) || STATIC_DEFAULTS.servicesHeading.headline,
    },
    statement: cinematicStatement
      ? {
          eyebrow: cinematicStatement.eyebrow,
          lines: cinematicStatement.lines,
          body: cinematicStatement.body,
          video: cinematicStatement.videoSrc,
        }
      : undefined,
    cta: STATIC_DEFAULTS.cta,
    processHeading: STATIC_DEFAULTS.processHeading,
    galleryHeading: STATIC_DEFAULTS.galleryHeading,
    redirect: STATIC_REDIRECTS[industry.slug],
  }
}

const NUMBER_WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']
function servicesHeadlineFor(cardCount: number): string {
  if (cardCount === 1) return 'One way it shows up'
  return NUMBER_WORDS[cardCount] ? `${NUMBER_WORDS[cardCount]} ways it shows up` : ''
}

/* Convenience wrappers — fetch + normalize in one call, for the common
   case of a Server Component that just wants the plain shape. */
export async function getNormalizedIndustries(draft = false): Promise<IndustryData[]> {
  const docs = await getIndustriesCollection(draft)
  const fromDb = docs.map(normalizeIndustry)
  // Any industry that only exists in the static file has no DB doc yet --
  // append it rather than requiring a CMS entry before it can appear
  // anywhere (nav dropdown, /portfolio wheel, /portfolio/[slug]). Since
  // 2026-10-01 every industry, Podcasts included, has a CMS doc on the
  // live site; this only matters on a fresh/local database.
  const dbSlugs = new Set(fromDb.map((i) => i.slug))
  const staticOnly = staticIndustries
    .filter((i) => !dbSlugs.has(i.slug))
    .map((industry, index) => staticToNormalized(industry, index))
  return [...fromDb, ...staticOnly]
}

export async function getNormalizedPortfolioProjects(draft = false): Promise<PortfolioProjectLocal[]> {
  const docs = await getPortfolioProjectsCollection(draft)
  return docs.map(normalizePortfolioProject)
}

export async function getNormalizedJournalPosts(draft = false): Promise<JournalPostLocal[]> {
  const docs = await getJournalPostsCollection(draft)
  return docs.map(normalizeJournalPost)
}
