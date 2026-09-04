import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getTermsOfServicePageGlobal } from '@/lib/payload-data'

/*
  Brought into the CMS 2026-08-26 -- see PrivacyPolicyPage's header
  comment (src/app/(frontend)/privacy-policy/page.tsx) for the full
  rationale; same pattern here.
*/

// 2026-09-04 mobile audit -- see PrivacyPolicyPage's matching comment
// (src/app/(frontend)/privacy-policy/page.tsx) for the full rationale;
// same missing-title bug, same fix.
export async function generateMetadata(): Promise<Metadata> {
  const draft = (await draftMode()).isEnabled
  const page = await getTermsOfServicePageGlobal(draft)
  const title = page?.title || 'Terms of Service'
  return {
    title: `${title} | Slate Cinema`,
    description:
      'Terms governing use of the Slate Cinema social media management service and the publishing platform that supports it.',
  }
}

export default async function TermsOfServicePage() {
  const draft = (await draftMode()).isEnabled
  const page = await getTermsOfServicePageGlobal(draft)
  const title = page?.title || 'Terms of Service'
  const dateline = page?.dateline || 'Last updated · 6 August 2026'

  return (
    <>
      <style>{`
  .legal-page { --ink:#0b0c0e; --panel:#101216; --line:#22262d; --text:#f4f5f7; --muted:#9aa1ab;
          --blue:#00AEEF; --orange:#f97316; }
  .legal-page * { box-sizing:border-box; }
  .legal-page { background:var(--ink); -webkit-font-smoothing:antialiased; }
  .legal-page .wrap { max-width:780px; margin:0 auto; padding:0 28px; }
  /* Scoped to .wrap, not the bare page -- a bare ".legal-page a" rule was
     leaking into the real <Nav />'s own links (also nested inside
     .legal-page), turning them blue instead of their normal white/50
     styling. That was the "its blue" bug Kauan flagged. */
  .legal-page .wrap a { color:var(--blue); }
  /* color/font also scoped to .wrap only, not the bare .legal-page -- same
     leak as the link-color bug above, but for typography: it was
     cascading into the real shared <Footer /> (also nested inside
     .legal-page), giving it a different typeface/size than every other
     page's footer. */
  .legal-page .wrap { color:var(--text);
         font:16.5px/1.75 -apple-system,'Segoe UI',system-ui,sans-serif; }

  /* Top margin cleared for the fixed shared Nav (see header comment). */
  .legal-page .docmark { display:flex; align-items:center; gap:12px; margin:144px 0 26px; }
  .legal-page .docmark img { width:44px; height:44px; }
  .legal-page .docmark span { font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:.14em; }
  .legal-page h1 { font-family:'Bebas Neue',sans-serif; font-weight:400; font-size:clamp(38px,6vw,58px);
       letter-spacing:.02em; line-height:1; margin:0 0 10px; }
  .legal-page .dateline { font-family:'Courier Prime',monospace; color:var(--orange); font-size:13px;
              letter-spacing:.3em; text-transform:uppercase; margin:0 0 44px; }
  .legal-page h2 { font-family:'Fraunces',Georgia,serif; font-weight:500; font-size:22px;
       letter-spacing:-.01em; margin:40px 0 10px; }
  .legal-page p, .legal-page li { color:var(--muted); }
  .legal-page p strong { color:var(--text); font-weight:600; }
  .legal-page .doc { padding-bottom:40px; }
      `}</style>

      <div className="legal-page">
        <Nav />

        <div className="wrap doc" data-cms-global="terms-of-service-page">
          <div className="docmark"><img src="/images/logo-mark.webp" alt="Slate Cinema app icon" /><span>SLATE CINEMA</span></div>
          <h1 data-cms-field="title">{title}</h1>
          <p className="dateline" data-cms-field="dateline">{dateline}</p>

          <div data-cms-field="body">
            {page?.body ? <RichText data={page.body} /> : null}
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
