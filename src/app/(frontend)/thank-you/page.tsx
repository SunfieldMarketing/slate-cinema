import type { Metadata } from 'next'
import { Suspense } from 'react'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { CheckCircle2, Mail, Clock3, PlayCircle, type LucideIcon } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/PageHero'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import ThankYouTracking from '@/components/ThankYouTracking'
import PageSections from '@/components/blocks/PageSections'
import { getThankYouPageGlobal } from '@/lib/payload-data'
import { loadBlocksData } from '@/lib/page-builder-data'
import { pageMetadata } from '@/lib/seo'
import { PAGE_META } from '@/lib/page-meta'

// noindex: this is a conversion-confirmation page, not something that
// should show up in search results or get direct organic traffic.
export async function generateMetadata(): Promise<Metadata> {
  const draft = (await draftMode()).isEnabled
  const page = await getThankYouPageGlobal(draft)
  return pageMetadata({
    path: '/thank-you',
    seo: page,
    title: PAGE_META.thankYou.title,
    description: PAGE_META.thankYou.description,
    noIndex: true,
  })
}

const ICONS: Record<string, LucideIcon> = { Mail, Clock3, PlayCircle }

const fallbackNextSteps = [
  { icon: 'Mail', title: 'Check your inbox', body: 'A confirmation just landed — reply to it any time if you think of something to add.' },
  { icon: 'Clock3', title: 'Replies within minutes', body: 'A real producer reviews every submission personally — no queue, no bot.' },
  { icon: 'PlayCircle', title: 'See more of our work', body: 'While you wait, take a look at recent projects across every industry we shoot.' },
]

export default async function ThankYouPage() {
  const draft = (await draftMode()).isEnabled
  const page = await getThankYouPageGlobal(draft)
  const blocksData = await loadBlocksData(page?.layout, draft)
  const hero = page?.hero
  const nextSteps = page?.nextSteps?.length ? page.nextSteps : fallbackNextSteps
  const confirmedLabel = page?.confirmedLabel || 'Confirmed'
  const primaryCtaLabel = page?.primaryCtaLabel || 'View Our Work'
  const primaryCtaHref = page?.primaryCtaHref || '/portfolio'
  const secondaryCtaLabel = page?.secondaryCtaLabel || 'Back to Home'
  const secondaryCtaHref = page?.secondaryCtaHref || '/'

  // Each built-in section, drawn in the order of the page's Sections list
  // (Thank You Page > Sections in /admin).
  const builtIns = {
    hero: (
      <div data-cms-global="thank-you-page">
        <PageHero
          eyebrow={hero?.eyebrow || 'Submission Received'}
          title={[hero?.titleLine1 || 'Got it —', hero?.titleLine2 || "we're on it."]}
          subtitle={hero?.subtitle || 'Thanks for reaching out to Slate Cinema. Your message is already in front of the team.'}
          accent="#10b981"
          eyebrowFieldPath="hero.eyebrow"
          titleFieldPaths={['hero.titleLine1', 'hero.titleLine2']}
          subtitleFieldPath="hero.subtitle"
        />
      </div>
    ),
    nextSteps: (
      <section className="relative w-full overflow-hidden py-12 md:py-16" data-cms-global="thank-you-page">
        <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-center gap-3 mb-10">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span data-cms-field="confirmedLabel" className="font-mono text-xs sm:text-sm tracking-[0.25em] text-emerald-400 uppercase">{confirmedLabel}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
            {nextSteps.map((s, i) => {
              const Icon = ICONS[s.icon || 'Mail'] || Mail
              return (
                <div key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 text-center">
                  <div className="w-11 h-11 mx-auto rounded-full border border-emerald-400/40 bg-ink flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div data-cms-field={`nextSteps.${i}.title`} className="text-white font-bold text-sm mb-1.5">{s.title}</div>
                  <p data-cms-field={`nextSteps.${i}.body`} className="text-white/55 text-xs font-light leading-relaxed">{s.body}</p>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={primaryCtaHref}
              data-cms-field="primaryCtaLabel"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold text-black bg-white hover:bg-[#00AEEF] hover:text-white transition-colors duration-300 w-full sm:w-auto"
            >
              {primaryCtaLabel}
            </Link>
            <Link
              href={secondaryCtaHref}
              data-cms-field="secondaryCtaLabel"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold text-white border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors duration-300 w-full sm:w-auto"
            >
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </section>
    ),
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-[#00AEEF] selection:text-white">
      <AmbientBackdrop accent="#10b981" />
      <Suspense fallback={null}>
        <ThankYouTracking />
      </Suspense>

      <div className="relative z-10 w-full">
        <Nav />

        <PageSections page="thankYou" layout={page?.layout} builtIns={builtIns} accent="#10b981" cms={{ global: 'thank-you-page' }} data={blocksData} />

        <Footer />
      </div>
    </main>
  )
}
