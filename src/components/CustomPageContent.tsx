'use client'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import StickyCta from '@/components/StickyCta'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import RenderBlocks from '@/components/blocks/RenderBlocks'
import type { BlocksData } from '@/components/blocks/types'
import type { Page } from '@/payload-types'

/*
  Shell for pages built in /admin (Custom pages): the site's nav, backdrop
  and footer around whatever sections the editor stacked. When the first
  visible section isn't a hero, the content gets top padding so it doesn't
  start underneath the fixed nav bar.
*/
export default function CustomPageContent({ page, data }: { page: Page; data: BlocksData }) {
  const accent = page.accent?.trim() || '#00AEEF'
  const blocks = page.layout ?? []
  const first = blocks.find((b) => !b.hidden)
  const startsWithHero = first?.blockType === 'hero'

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-brand-blue selection:text-white">
      <AmbientBackdrop accent={accent} />

      <div className="relative z-10 w-full">
        <Nav />

        <div data-cms-collection="pages" data-cms-doc-id={String(page.id)} className={startsWithHero ? '' : 'pt-24 md:pt-28'}>
          {first ? (
            <RenderBlocks blocks={blocks} accent={accent} data={data} />
          ) : (
            // A brand-new page with no sections yet still shows its title
            // rather than an empty screen.
            <section className="relative w-full py-24 md:py-32">
              <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 text-center">
                <h1 data-cms-field="title" className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white leading-[1.02]">
                  {page.title}
                </h1>
              </div>
            </section>
          )}
        </div>

        <Footer />

        {page.stickyButton && <StickyCta accent={accent} />}
      </div>
    </main>
  )
}
