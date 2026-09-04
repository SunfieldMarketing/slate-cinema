import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getSocialMediaManagementPageGlobal, getSiteSettings } from '@/lib/payload-data'

/*
  Brought into the CMS 2026-08-26 (see src/globals/SocialMediaManagementPage.ts
  for the full field-shape rationale) -- previously fully hardcoded, ported
  verbatim from the finished HTML per the TikTok Content Posting API build
  brief. Design/CSS untouched; only the copy now comes from the CMS, with
  the exact original text as every field's fallback so a never-published
  or not-yet-migrated global still renders identically to before.

  cta.altText's email address is deliberately NOT a CMS field on this
  global -- it's pulled from Site Settings > Contact, the single existing
  source of truth for that address (matches how ContactPageContent.tsx's
  StudioLocation/ContactMethods sections already do it), so it can't drift
  out of sync with the real contact email if that ever changes.
*/

// 2026-09-04 mobile audit: this page (and privacy-policy, terms-of-service --
// all three brought into the CMS on the same 2026-08-26 pass) had no `title`
// in its exported metadata, so Next fell back to the root layout's generic
// "Slate Cinema" for the browser tab / bookmarks / search results, unlike
// every other page in the app. No CMS field holds an SEO title for this
// global, so a plain static string here (matching the nav label) is the
// right fix -- no need for generateMetadata/CMS wiring for this one.
export const metadata: Metadata = {
  title: 'Social Media Management | Slate Cinema',
  description:
    "We run social media for businesses that need to focus on operations. Slate Cinema plans, produces, schedules and publishes social content for client businesses across Instagram, Facebook, TikTok, YouTube and X — from one calendar, with one approval step, on the client's own accounts.",
}

export default async function SocialMediaManagementPage() {
  const draft = (await draftMode()).isEnabled
  const [page, settings] = await Promise.all([
    getSocialMediaManagementPageGlobal(draft),
    getSiteSettings(draft),
  ])

  const hero = page?.hero
  const howItWorks = page?.howItWorks
  const included = page?.included
  const cta = page?.cta
  const email = settings?.contact?.email || 'info@slatecinema.com'

  const fallbackSteps = [
    { title: 'Your workspace', body: 'Every client business gets its own workspace: its own calendar, its own content library, its own approvals.' },
    { title: 'Your accounts stay yours', body: "You connect your own social accounts through each platform's official authorization screen. You own the accounts, the audience and the content. You can disconnect at any time, and access ends immediately." },
    { title: 'We build the calendar', body: 'We plan the month, produce or edit the content, write the captions, and load everything into your calendar with the dates and times we recommend.' },
    { title: 'You approve — final cut is yours', body: 'Nothing publishes until someone at your business approves it. Every published post traces back to a named approval.' },
    { title: 'It publishes, and you see what happened', body: 'Approved posts go out automatically at the scheduled time, to every platform you selected. Views, reach, engagement and follower growth come back into the same dashboard.' },
  ]
  const steps = howItWorks?.steps?.length ? howItWorks.steps : null

  const fallbackIncluded = [
    'Content calendar across Instagram, Facebook, TikTok, YouTube and X',
    'Post production and editing, or scheduling of content you supply',
    'Captions, hashtags and posting-time strategy',
    'An approval gate before anything goes live',
    'Performance reporting in one place, updated automatically',
  ]
  const includedItems = included?.items?.length ? included.items.map((i) => i.text) : fallbackIncluded

  return (
    <>
      <style>{`
  .smm-page {
    --ink:#0b0c0e; --panel:#101216; --line:#22262d;
    --text:#f4f5f7; --muted:#9aa1ab;
    --blue:#00AEEF; --orange:#f97316; --orange-soft:rgba(249,115,22,.12);
  }
  .smm-page * { box-sizing:border-box; }
  .smm-page { background:var(--ink); -webkit-font-smoothing:antialiased; }
  .smm-page .mono { font-family:'Courier Prime',Courier,monospace; }
  .smm-page .wrap { max-width:1100px; margin:0 auto; padding:0 28px; }
  .smm-page .wrap a { color:var(--blue); }
  .smm-page .hero, .smm-page section { color:var(--text);
         font:16.5px/1.7 -apple-system,'Segoe UI',system-ui,sans-serif; }

  .smm-page .hero { padding:168px 0 64px; border-bottom:1px solid var(--line); position:relative; overflow:hidden; }
  .smm-page .eyebrow { font-family:'Courier Prime',monospace; color:var(--orange); font-size:13px;
             letter-spacing:.5em; text-transform:uppercase; margin-bottom:22px; }
  .smm-page h1 { font-family:'Bebas Neue',sans-serif; font-weight:400; letter-spacing:.015em;
       font-size:clamp(46px,7.5vw,88px); line-height:.98; margin:0 0 24px; }
  .smm-page h1 em { font-style:normal; color:var(--blue); white-space:nowrap; }
  .smm-page .lede { font-family:'Fraunces',Georgia,serif; font-size:clamp(17px,2.1vw,21px);
          color:var(--muted); max-width:62ch; margin:0; }
  .smm-page .lede p { margin: 0; }
  .smm-page .lede strong { color:var(--text); font-weight:500; }

  .smm-page .sprockets { position:absolute; top:0; bottom:0; right:0; width:26px; opacity:.5;
    background-image:repeating-linear-gradient(to bottom, transparent 0 10px, var(--line) 10px 24px);
    background-size:14px 34px; background-repeat:repeat-y; background-position:center; }

  .smm-page h2.slate { font-family:'Courier Prime',monospace; font-weight:700; font-size:13px;
             letter-spacing:.4em; text-transform:uppercase; color:var(--muted); margin:0 0 30px; }
  .smm-page section { padding:64px 0; }
  .smm-page section + section { border-top:1px solid var(--line); }

  .smm-page .steps { display:flex; flex-direction:column; }
  .smm-page .step { display:grid; grid-template-columns:86px 1fr; gap:22px; padding:26px 0;
          border-bottom:1px solid var(--line); }
  .smm-page .step:last-child { border-bottom:0; }
  .smm-page .step .num { font-family:'Courier Prime',monospace; color:var(--orange); font-size:15px; padding-top:6px; }
  .smm-page .step h3 { margin:0 0 8px; font-size:21px; font-weight:650; letter-spacing:-.01em; }
  .smm-page .step p { margin:0; color:var(--muted); max-width:70ch; }
  .smm-page .step p strong { color:var(--text); font-weight:600; }

  .smm-page .twocol { display:grid; grid-template-columns:1.1fr .9fr; gap:56px; align-items:start; }
  .smm-page ul.incl { list-style:none; margin:0; padding:0; }
  .smm-page ul.incl li { padding:14px 0 14px 34px; border-bottom:1px solid var(--line); position:relative; }
  .smm-page ul.incl li:last-child { border-bottom:0; }
  .smm-page ul.incl li::before { content:"▸"; position:absolute; left:2px; color:var(--orange); }

  .smm-page .cta { background:var(--panel); border:1px solid var(--line); border-radius:14px; padding:34px; }
  .smm-page .cta .mono-tag { font-family:'Courier Prime',monospace; color:var(--orange); font-size:12px;
                   letter-spacing:.4em; text-transform:uppercase; margin-bottom:14px; }
  .smm-page .cta h3 { font-family:'Bebas Neue',sans-serif; font-weight:400; font-size:34px;
            letter-spacing:.02em; margin:0 0 12px; }
  .smm-page .cta p { color:var(--muted); margin:0 0 24px; }
  .smm-page .cta a.go { display:inline-block; border-radius:30px; background:var(--orange); color:#0b0c0e;
              font-weight:700; padding:13px 26px; text-decoration:none; }
  .smm-page .cta .alt { display:block; margin-top:14px; font-size:14.5px; }

  @media (max-width:860px) {
    .smm-page .twocol { grid-template-columns:1fr; gap:38px; }
    .smm-page .step { grid-template-columns:56px 1fr; }
  }
      `}</style>

      <div className="smm-page">
        <Nav />

        <div className="hero" data-cms-global="social-media-management-page">
          <div className="sprockets" aria-hidden="true" />
          <div className="wrap">
            <div className="eyebrow" data-cms-field="hero.eyebrow">{hero?.eyebrow || 'Distribution · Always On'}</div>
            <h1>
              <span data-cms-field="hero.headlineText">{hero?.headlineText || 'We run social media for businesses that need to'}</span>{' '}
              <em data-cms-field="hero.headlineEmphasis">{hero?.headlineEmphasis || 'focus on operations.'}</em>
            </h1>
            <div className="lede" data-cms-field="hero.lede">
              {hero?.lede ? (
                <RichText data={hero.lede} />
              ) : (
                <p>Slate Cinema plans, produces, schedules and publishes social content for client
                businesses across Instagram, Facebook, TikTok, YouTube and X — from one calendar, with one
                approval step, <strong>on the client&apos;s own accounts</strong>. The same crew that shoots your
                story keeps it on screen, week after week.</p>
              )}
            </div>
          </div>
        </div>

        <section data-cms-global="social-media-management-page">
          <div className="wrap">
            <h2 className="slate" data-cms-field="howItWorks.heading">{howItWorks?.heading || 'How it works'}</h2>
            <div className="steps">
              {(steps || fallbackSteps).map((s, i) => (
                <div className="step" key={s.title}>
                  <div className="num mono">{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <h3 data-cms-field={`howItWorks.steps.${i}.title`}>{s.title}</h3>
                    <div data-cms-field={`howItWorks.steps.${i}.body`}>
                      {steps && 'body' in s && typeof s.body === 'object' ? (
                        <RichText data={s.body} />
                      ) : (
                        <p>{typeof s.body === 'string' ? s.body : ''}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section data-cms-global="social-media-management-page">
          <div className="wrap twocol">
            <div>
              <h2 className="slate" data-cms-field="included.heading">{included?.heading || "What's included"}</h2>
              <ul className="incl">
                {includedItems.map((text, i) => (
                  <li key={text} data-cms-field={`included.items.${i}.text`}>{text}</li>
                ))}
              </ul>
            </div>
            <div className="cta">
              <div className="mono-tag" data-cms-field="cta.monoTag">{cta?.monoTag || 'Now scheduling'}</div>
              <h3 data-cms-field="cta.heading">{cta?.heading || 'One calendar. One approval. Action.'}</h3>
              <p data-cms-field="cta.body">{cta?.body || "Tell us about your business and what you want your social to do — we'll get back to you with a plan."}</p>
              <a className="go" href={cta?.buttonHref || '/schedule-a-call'} data-cms-field="cta.buttonLabel">{cta?.buttonLabel || 'Schedule a call'}</a>
              <span className="alt"><span data-cms-field="cta.altText">{cta?.altText || 'Or email'}</span> <a href={`mailto:${email}`}>{email}</a></span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
