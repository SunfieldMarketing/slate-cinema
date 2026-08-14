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
  getIndustriesCollection,
  getPortfolioProjectsCollection,
  getJournalPostsCollection,
} from '@/lib/payload-data'
import type { Category as PipelineCategory } from '@/lib/pipeline-data'
import {
  industries as staticIndustries,
  type IndustryData as StaticIndustryData,
  type IndustryClient as StaticIndustryClient,
  type IndustryCinematicStatement as StaticIndustryCinematicStatement,
} from '@/lib/industries'

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
  featured?: boolean
}
export interface IndustryVideoTestimonial {
  quote: string
  name: string
  role: string
  company: string
  video: string
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
  gallery: string[]
  stats: IndustryStat[]
  services: string[]
  testimonial?: { quote: string; name: string; role: string; company: string }
  serviceCards?: IndustryServiceCard[]
  videoTestimonials?: IndustryVideoTestimonial[]
  process?: IndustryProcessStep[]
  faqs?: IndustryFaqItem[]
  clientShowcase?: StaticIndustryClient[]
  cinematicStatement?: StaticIndustryCinematicStatement
}

export function normalizeIndustry(doc: Industry): IndustryData {
  return {
    id: String(doc.id),
    slug: doc.slug,
    label: doc.label,
    icon: doc.icon,
    accent: doc.accent,
    blurb: doc.blurb,
    description: doc.description,
    stat: doc.stat,
    heroImage: mediaUrl(doc.heroImage) || '',
    heroVideo: mediaUrl(doc.heroVideo) || '',
    gallery: (doc.gallery ?? []).map((g) => mediaUrl(g.image) || '').filter(Boolean),
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
      image: mediaUrl(sc.image) || '',
      video: mediaUrl(sc.video),
      featured: sc.featured ?? false,
    })),
    videoTestimonials: (doc.videoTestimonials ?? []).map((vt) => ({
      quote: vt.quote,
      name: vt.name,
      role: vt.role,
      company: vt.company,
      video: mediaUrl(vt.video) || '',
      outcome: vt.outcome,
      poster: mediaUrl(vt.poster),
      logo: mediaUrl(vt.logo),
    })),
    process: (doc.process ?? []).map((p) => ({ week: p.week, title: p.title, body: p.body })),
    faqs: (doc.faqs ?? []).map((f) => ({ question: f.question, answer: f.answer })),
    // clientShowcase / cinematicStatement ("the Athletics format") stay
    // code-only -- overlaid from src/lib/industries.ts by slug rather than
    // round-tripped through Payload, same reasoning as the comment on
    // IndustryData.clientShowcase. Not in the Industry doc type at all,
    // so there's nothing to read off `doc` here; see getNormalizedIndustries.
    clientShowcase: staticIndustries.find((i) => i.slug === doc.slug)?.clientShowcase,
    cinematicStatement: staticIndustries.find((i) => i.slug === doc.slug)?.cinematicStatement,
  }
}

export interface PortfolioProjectLocal {
  title: string
  category: string
  company: string
  url: string
  copy: string
  metrics: { label: string; value: string }[]
  video?: string
}

export function normalizePortfolioProject(doc: PayloadPortfolioProject): PortfolioProjectLocal {
  return {
    title: doc.title,
    category: doc.category,
    company: doc.company,
    url: mediaUrl(doc.poster) || '',
    copy: doc.copy,
    metrics: (doc.metrics ?? []).map((m) => ({ label: m.label, value: m.value })),
    video: mediaUrl(doc.video),
  }
}

export interface JournalPostLocal {
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
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    category: doc.category,
    accent: doc.accent,
    date: doc.date,
    readTime: doc.readTime,
    coverImage: mediaUrl(doc.coverImage) || '',
    author: doc.author,
    content: doc.content,
  }
}

/* The Production Pipeline categories -- shared between Home and How It
   Works. Payload's array-field requirements wrap `tags` as `{tag}[]`
   objects and `id` as `categoryId`; unwrap back to the plain shape
   Pipeline.tsx already expects (src/lib/pipeline-data.ts's Category). */
export function normalizePipeline(doc: PayloadPipeline | null): PipelineCategory[] {
  return (doc?.categories ?? []).map((c) => ({
    id: c.categoryId,
    title: c.title,
    video: mediaUrl(c.video) || '',
    color: c.color,
    services: (c.services ?? []).map((s) => ({
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
function staticToNormalized(industry: StaticIndustryData): IndustryData {
  const iconName = (industry.icon as unknown as { displayName?: string }).displayName || 'Film'
  return { ...industry, icon: iconName }
}

/* Convenience wrappers — fetch + normalize in one call, for the common
   case of a Server Component that just wants the plain shape. */
export async function getNormalizedIndustries(): Promise<IndustryData[]> {
  const docs = await getIndustriesCollection()
  const fromDb = docs.map(normalizeIndustry)
  // Any industry that only exists in the static file (e.g. "podcasts",
  // added 2026-08-13 per "make the podcasts page just an industry page
  // same format and everything") has no DB doc yet -- append it as-is
  // rather than requiring a CMS entry before it can appear anywhere
  // (nav dropdown, /portfolio wheel, /portfolio/[slug]).
  const dbSlugs = new Set(fromDb.map((i) => i.slug))
  const staticOnly = staticIndustries.filter((i) => !dbSlugs.has(i.slug)).map(staticToNormalized)
  return [...fromDb, ...staticOnly]
}

export async function getNormalizedPortfolioProjects(): Promise<PortfolioProjectLocal[]> {
  const docs = await getPortfolioProjectsCollection()
  return docs.map(normalizePortfolioProject)
}

export async function getNormalizedJournalPosts(): Promise<JournalPostLocal[]> {
  const docs = await getJournalPostsCollection()
  return docs.map(normalizeJournalPost)
}
