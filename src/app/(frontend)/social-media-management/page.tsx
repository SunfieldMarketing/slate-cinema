import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

/*
  Ported verbatim (design + copy) from the finished HTML Jake sent
  (social-media-management.html) per the TikTok Content Posting API
  build brief -- this page's existence and reachability from the
  homepage/top nav is itself a platform-approval requirement, and the
  copy is legally reviewed to ship as-is, not paraphrased.

  Two things intentionally dropped from the raw file since they're
  already handled globally by the app rather than needing to be
  redeclared per page: the external Google Fonts <link> (Bebas Neue /
  Courier Prime / Fraunces are already loaded via next/font in the root
  layout) and the page-level favicon <link> (already set site-wide in
  (frontend)/layout.tsx's generateMetadata). PostHog tracking and the
  JSON-LD organization schema are also already global via
  instrumentation-client.ts and the root layout respectively -- nothing
  extra to add for those either, just by virtue of this being a real
  route inside the (frontend) app.

  Header switched to the real, shared <Nav /> 2026-08-13 -- the
  hand-rolled header (kept per "keep the page design exactly how it is
  in the html") had drifted into a visibly different navbar/mobile-menu
  than the rest of the site, which Kauan flagged directly. Nav is
  `position:fixed`, so the first section below carries extra top
  padding to clear it (see the .hero rule's padding-top). Only the
  header changed; the legally-reviewed copy below it is untouched.
*/

export const metadata: Metadata = {
  description:
    "We run social media for businesses that need to focus on operations. Slate Cinema plans, produces, schedules and publishes social content for client businesses across Instagram, Facebook, TikTok, YouTube and X — from one calendar, with one approval step, on the client's own accounts.",
}

export default function SocialMediaManagementPage() {
  return (
    <>
      <style>{`
  .smm-page {
    --ink:#0b0c0e; --panel:#101216; --line:#22262d;
    --text:#f4f5f7; --muted:#9aa1ab;
    --blue:#00AEEF; --orange:#f97316; --orange-soft:rgba(249,115,22,.12);
  }
  .smm-page * { box-sizing:border-box; }
  .smm-page { background:var(--ink); color:var(--text);
         font:16.5px/1.7 -apple-system,'Segoe UI',system-ui,sans-serif; -webkit-font-smoothing:antialiased; }
  .smm-page .mono { font-family:'Courier Prime',Courier,monospace; }
  .smm-page .wrap { max-width:1100px; margin:0 auto; padding:0 28px; }
  /* Scoped to .wrap (body copy), not the bare page -- a bare ".smm-page a"
     rule was leaking into the real <Nav />'s own links (also nested
     inside .smm-page), turning them blue instead of their normal
     white/50 styling. That was the "its blue" bug Kauan flagged. */
  .smm-page .wrap a { color:var(--blue); }

  /* hero -- padding-top cleared for the fixed shared Nav (see header comment) */
  .smm-page .hero { padding:168px 0 64px; border-bottom:1px solid var(--line); position:relative; overflow:hidden; }
  .smm-page .eyebrow { font-family:'Courier Prime',monospace; color:var(--orange); font-size:13px;
             letter-spacing:.5em; text-transform:uppercase; margin-bottom:22px; }
  .smm-page h1 { font-family:'Bebas Neue',sans-serif; font-weight:400; letter-spacing:.015em;
       font-size:clamp(46px,7.5vw,88px); line-height:.98; margin:0 0 24px; }
  .smm-page h1 em { font-style:normal; color:var(--blue); }
  .smm-page .lede { font-family:'Fraunces',Georgia,serif; font-size:clamp(17px,2.1vw,21px);
          color:var(--muted); max-width:62ch; margin:0; }
  .smm-page .lede strong { color:var(--text); font-weight:500; }

  /* film sprocket strip, like the how-it-works panels */
  .smm-page .sprockets { position:absolute; top:0; bottom:0; right:0; width:26px; opacity:.5;
    background-image:repeating-linear-gradient(to bottom, transparent 0 10px, var(--line) 10px 24px);
    background-size:14px 34px; background-repeat:repeat-y; background-position:center; }

  .smm-page h2.slate { font-family:'Courier Prime',monospace; font-weight:700; font-size:13px;
             letter-spacing:.4em; text-transform:uppercase; color:var(--muted); margin:0 0 30px; }
  .smm-page section { padding:64px 0; }
  .smm-page section + section { border-top:1px solid var(--line); }

  /* numbered steps — 01..05 like the Distribution accordion */
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

        <div className="hero">
          <div className="sprockets" aria-hidden="true" />
          <div className="wrap">
            <div className="eyebrow">Distribution&nbsp;·&nbsp;Always&nbsp;On</div>
            <h1>We run social media for businesses that need to <em>focus on operations.</em></h1>
            <p className="lede">Slate Cinema plans, produces, schedules and publishes social content for client
            businesses across Instagram, Facebook, TikTok, YouTube and X — from one calendar, with one
            approval step, <strong>on the client&apos;s own accounts</strong>. The same crew that shoots your
            story keeps it on screen, week after week.</p>
          </div>
        </div>

        <section>
          <div className="wrap">
            <h2 className="slate">How it works</h2>
            <div className="steps">
              <div className="step"><div className="num mono">01</div>
                <div><h3>Your workspace</h3>
                <p>Every client business gets its own workspace: its own calendar, its own content library,
                its own approvals.</p></div></div>
              <div className="step"><div className="num mono">02</div>
                <div><h3>Your accounts stay yours</h3>
                <p>You connect your own social accounts through each platform&apos;s official authorization
                screen. <strong>You own the accounts, the audience and the content.</strong> You can
                disconnect at any time, and access ends immediately.</p></div></div>
              <div className="step"><div className="num mono">03</div>
                <div><h3>We build the calendar</h3>
                <p>We plan the month, produce or edit the content, write the captions, and load everything
                into your calendar with the dates and times we recommend.</p></div></div>
              <div className="step"><div className="num mono">04</div>
                <div><h3>You approve — final cut is yours</h3>
                <p>Nothing publishes until someone at your business approves it. Every published post
                traces back to a named approval.</p></div></div>
              <div className="step"><div className="num mono">05</div>
                <div><h3>It publishes, and you see what happened</h3>
                <p>Approved posts go out automatically at the scheduled time, to every platform you
                selected. Views, reach, engagement and follower growth come back into the same
                dashboard.</p></div></div>
            </div>
          </div>
        </section>

        <section>
          <div className="wrap twocol">
            <div>
              <h2 className="slate">What&apos;s included</h2>
              <ul className="incl">
                <li>Content calendar across Instagram, Facebook, TikTok, YouTube and X</li>
                <li>Post production and editing, or scheduling of content you supply</li>
                <li>Captions, hashtags and posting-time strategy</li>
                <li>An approval gate before anything goes live</li>
                <li>Performance reporting in one place, updated automatically</li>
              </ul>
            </div>
            <div className="cta">
              <div className="mono-tag">Now scheduling</div>
              <h3>One calendar. One approval. Action.</h3>
              <p>Tell us about your business and what you want your social to do — we&apos;ll get back to you
              with a plan.</p>
              <a className="go" href="/schedule-a-call">Schedule a call</a>
              <span className="alt">Or email <a href="mailto:info@slatecinema.com">info@slatecinema.com</a></span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
