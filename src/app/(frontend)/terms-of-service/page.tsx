import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageSections from '@/components/blocks/PageSections'
import { getTermsOfServicePageGlobal } from '@/lib/payload-data'
import { loadBlocksData } from '@/lib/page-builder-data'
import { pageMetadata } from '@/lib/seo'
import { PAGE_META } from '@/lib/page-meta'

/*
  Brought into the CMS 2026-08-26 -- see PrivacyPolicyPage's header
  comment (src/app/(frontend)/privacy-policy/page.tsx) for the full
  rationale; same pattern here.
*/

// 2026-09-04 mobile audit -- see PrivacyPolicyPage's matching comment
// (src/app/(frontend)/privacy-policy/page.tsx) for the full rationale
// and the bare-title (no manual "| Slate Cinema" suffix) note; same
// missing-title bug, same fix.
export async function generateMetadata(): Promise<Metadata> {
  const draft = (await draftMode()).isEnabled
  const page = await getTermsOfServicePageGlobal(draft)
  return pageMetadata({
    path: '/terms-of-service',
    seo: page,
    title: page?.title || 'Terms of Service',
    description: PAGE_META.terms.description,
  })
}

export default async function TermsOfServicePage() {
  const draft = (await draftMode()).isEnabled
  const page = await getTermsOfServicePageGlobal(draft)
  const blocksData = await loadBlocksData(page?.layout, draft)
  const title = page?.title || 'Terms of Service'
  const dateline = page?.dateline || 'Last updated · 6 August 2026'

  // The document itself is the page's one built-in section; editors can add
  // library sections above or below it (Sections in /admin). It carries its
  // own .legal-page scope so the stylesheet above only styles the document --
  // not added sections, and not the shared Nav/Footer (until 2026-10-02
  // ".legal-page h1" restyled the footer wordmark on this page).
  const builtIns = {
    document: (
      <div className="legal-page">
        <div className="wrap doc" data-cms-global="terms-of-service-page">
          <div className="docmark"><img src="/images/logo-mark.webp" alt="Slate Cinema app icon" /><span>SLATE CINEMA</span></div>
          <h1 data-cms-field="title">{title}</h1>
          <p className="dateline" data-cms-field="dateline">{dateline}</p>

          <div data-cms-field="body">
            {page?.body ? <RichText data={page.body} /> : null}
          </div>
        </div>
      </div>
    ),
  }

  return (
    <>
      <style>{`
  .legal-page { --ink:#0b0c0e; --panel:#101216; --line:#22262d; --text:#f4f5f7; --muted:#9aa1ab;
          --blue:var(--color-brand-blue); --orange:#f97316; }
  .legal-page * { box-sizing:border-box; }
  .legal-page { background:var(--ink); -webkit-font-smoothing:antialiased; }
  .legal-page .wrap { max-width:780px; margin:0 auto; padding:0 28px; }
  /* Scoped to .wrap, not the bare page -- a bare ".legal-page a" rule was
     leaking into the real <Nav />'s own links (also nested inside
     .legal-page), turning them blue instead of their normal white/50
     styling. That was the "its blue" bug Kauan flagged. */
  .legal-page .wrap a { color:var(--blue); text-decoration:underline; text-underline-offset:3px; text-decoration-thickness:1px; }
  /* Underlined (2026-11-04 re-audit): colour alone (1.02:1 against the grey body text) didn't
     mark these as links for anyone who can't tell the blue apart. */
  /* color/font also scoped to .wrap only, not the bare .legal-page -- same
     leak as the link-color bug above, but for typography: it was
     cascading into the real shared <Footer /> (also nested inside
     .legal-page), giving it a different typeface/size than every other
     page's footer. */
  .legal-page .wrap { color:var(--text);
         font:16.5px/1.75 var(--font-inter),system-ui,sans-serif; }

  /* Top margin cleared for the fixed shared Nav (see header comment). */
  .legal-page .docmark { display:flex; align-items:center; gap:12px; margin:144px 0 26px; }
  .legal-page .docmark img { width:44px; height:44px; }
  /* Main-site type (2026-11-04, Oct 27 audit #16): Inter headings like every other page, the
     brand colour for the dateline, instead of Bebas Neue / Fraunces / orange. The app icon +
     wordmark above the H1 stay -- that part is a TikTok review requirement. */
  .legal-page .docmark span { font-family:var(--font-inter),sans-serif; font-weight:700; font-size:16px; letter-spacing:.18em; }
  .legal-page h1 { font-family:var(--font-inter),sans-serif; font-weight:900; font-size:clamp(38px,6vw,60px);
       letter-spacing:-.045em; line-height:1.02; margin:0 0 14px; }
  .legal-page .dateline { font-family:'Courier Prime',monospace; color:var(--blue); font-size:13px;
              letter-spacing:.3em; text-transform:uppercase; margin:0 0 44px; }
  .legal-page h2 { font-family:var(--font-inter),sans-serif; font-weight:700; font-size:22px;
       letter-spacing:-.02em; line-height:1.25; margin:40px 0 10px; }
  .legal-page p, .legal-page li { color:var(--muted); }
  .legal-page p strong, .legal-page li strong { color:var(--text); font-weight:600; }
  /* Same list fix as the privacy policy (Oct 27 audit #36): bullets restored. */
  .legal-page ul { padding-left:22px; list-style:disc; } .legal-page ol { padding-left:22px; list-style:decimal; }
  .legal-page li { margin-bottom:10px; } .legal-page li::marker { color:var(--blue); }
  .legal-page .doc { padding-bottom:40px; }
      `}</style>

      <div className="bg-ink antialiased">
        <Nav />

        <main>
          <PageSections page="terms" layout={page?.layout} builtIns={builtIns} cms={{ global: 'terms-of-service-page' }} data={blocksData} />
        </main>

        <Footer />
      </div>
    </>
  )
}
