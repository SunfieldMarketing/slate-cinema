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

/* Convenience wrappers — fetch + normalize in one call, for the common
   case of a Server Component that just wants the plain shape. */
export async function getNormalizedIndustries(): Promise<IndustryData[]> {
  const docs = await getIndustriesCollection()
  return docs.map(normalizeIndustry)
}

export async function getNormalizedPortfolioProjects(): Promise<PortfolioProjectLocal[]> {
  const docs = await getPortfolioProjectsCollection()
  return docs.map(normalizePortfolioProject)
}

export async function getNormalizedJournalPosts(): Promise<JournalPostLocal[]> {
  const docs = await getJournalPostsCollection()
  return docs.map(normalizeJournalPost)
}
