import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'

/*
  The 404 page (Oct 27 audit #28). A visitor lands here from a mistyped
  address, an old link from Google, an ad or a social post, or a page that
  was renamed or moved. It used to be the bare default ("404 | This page
  could not be found.") with no logo, no menu and no way back -- so every
  stale link was a lost visitor.

  Every unmatched address under the site reaches this: the [...slug]
  catch-all calls notFound() for anything that isn't a Custom page, and
  the industry and journal routes do the same. Next keeps the real 404
  status and adds noindex, so search engines don't list it.
*/
export const metadata: Metadata = {
  title: 'Page not found',
}

const links = [
  { label: 'Home', href: '/', primary: true },
  { label: 'Our Work', href: '/portfolio', primary: false },
  { label: 'Contact', href: '/contact', primary: false },
]

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-brand-blue selection:text-white">
      <AmbientBackdrop />

      <div className="relative z-10 w-full">
        <Nav />

        <section className="relative w-full min-h-[78vh] flex items-center justify-center px-5 sm:px-8 pt-28 pb-16 text-center">
          <div className="w-full max-w-2xl">
            <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.35em] uppercase mb-6 text-brand-blue">
              <span className="w-8 h-px bg-brand-blue/40" />
              Error 404
              <span className="w-8 h-px bg-brand-blue/40" />
            </span>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white leading-[1.05] text-balance">
              That page has moved or never existed.
            </h1>

            <p className="mt-6 text-white/70 text-base sm:text-lg font-light leading-relaxed text-balance">
              Check the address for typos, or head back to one of these.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {links.map((link) =>
                link.primary ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold text-black bg-white hover:bg-brand-blue hover:text-white transition-colors duration-300 w-full sm:w-auto"
                  >
                    {link.label}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-semibold text-white border border-white/25 bg-white/[0.04] hover:border-white/60 transition-colors duration-300 w-full sm:w-auto"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
