import { getNormalizedIndustries, getNormalizedJournalPosts } from '@/lib/normalize'
import { getSiteSettings } from '@/lib/payload-data'
import { DEFAULT_DESCRIPTION } from '@/lib/seo'
import { SITE_URL } from '@/lib/site-url'

/*
  /llms-full.txt (2026-11-07, Levi's AI-search list #4): the whole fact file in one fetch for
  AI crawlers -- every industry page with its services and FAQs, the contact facts, and the
  Journal. Built from the CMS rather than hand-written, so it can't drift from the site. If a
  hand-written public/llms-full.txt is added later, delete this route so the static file wins.
*/
export const revalidate = 3600

const clean = (s?: string | null) => (s ?? '').replace(/\s+/g, ' ').trim()

export async function GET() {
  const [settings, industries, posts] = await Promise.all([getSiteSettings(), getNormalizedIndustries(), getNormalizedJournalPosts()])
  const c = settings.contact
  const lines: string[] = []
  const add = (...l: string[]) => lines.push(...l)

  add(
    '# Slate Cinema — full fact file',
    '',
    `> ${clean(settings.seo?.defaultDescription) || DEFAULT_DESCRIPTION}`,
    '',
    'Slate Cinema is a video production and video editing studio in Brooklyn, New York. It is a video production company, not a movie theater. It is based in Brooklyn, shoots across New York City, and works on location nationwide.',
    '',
    '## Contact',
    '',
    ...(c?.email ? [`- Email: ${c.email}`] : []),
    ...(c?.phone ? [`- Phone: ${c.phone}`] : []),
    ...(c?.addressLine ? [`- Studio: ${[c.addressLine, c.city, [c.state, c.postalCode].filter(Boolean).join(' ')].filter(Boolean).join(', ')}`] : []),
    `- Website: ${SITE_URL}`,
    `- Start a project: ${SITE_URL}/contact`,
    '',
    '## How a project runs',
    '',
    `Every project goes through four phases, explained at ${SITE_URL}/how-it-works:`,
    '',
    '1. Pre-production: scripts, storyboards, casting, locations and scheduling.',
    '2. Production: on-set filming with a full crew.',
    '3. Post-production: editing, color grading, sound design, motion graphics and VFX.',
    '4. Distribution: platform-native cuts for every channel, ad management and social strategy.',
    '',
    `Social media management (content calendars, posting and reporting) is described at ${SITE_URL}/social-media-management.`,
    '',
    '## Industries',
  )

  for (const ind of industries.filter((i) => !i.seo?.noIndex)) {
    add('', `### ${ind.label}`, '', `Page: ${SITE_URL}/portfolio/${ind.slug}`)
    if (clean(ind.description)) add('', clean(ind.description))
    const cards = ind.serviceCards ?? []
    if (cards.length) {
      add('', 'Services:')
      for (const s of cards) add(`- ${clean(s.title)}${clean(s.description) ? `: ${clean(s.description)}` : ''}`)
    }
    const faqs = (ind.faqs ?? []).filter((f) => clean(f.question) && clean(f.answer))
    if (faqs.length) {
      add('', 'Questions:')
      for (const f of faqs) add('', `Q: ${clean(f.question)}`, `A: ${clean(f.answer)}`)
    }
  }

  const visiblePosts = posts.filter((p) => !p.seo?.noIndex)
  if (visiblePosts.length) {
    add('', '## Journal', '')
    for (const p of visiblePosts) add(`- [${clean(p.title)}](${SITE_URL}/journal/${p.slug})${clean(p.excerpt) ? `: ${clean(p.excerpt)}` : ''}`)
  }

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
