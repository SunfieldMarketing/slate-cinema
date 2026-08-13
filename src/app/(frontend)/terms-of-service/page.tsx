import type { Metadata } from 'next'
import SMMMobileNav from '@/components/SMMMobileNav'

/*
  Ported verbatim (design + copy) from the finished HTML Jake sent
  (terms-of-service.html) per the TikTok Content Posting API build
  brief. Copy is legally reviewed to ship as-is. See
  social-media-management/page.tsx's header comment for why the
  external font <link> and page-level favicon <link> from the raw file
  were dropped -- both are already global via next/font and the root
  layout's metadata. The Privacy link inside this page is the absolute
  URL per the brief ("a relative link 404'd on a reviewer last time").
*/

export const metadata: Metadata = {
  description:
    'Terms governing use of the Slate Cinema social media management service and the publishing platform that supports it.',
}

export default function TermsOfServicePage() {
  return (
    <>
      <style>{`
  .legal-page { --ink:#0b0c0e; --panel:#101216; --line:#22262d; --text:#f4f5f7; --muted:#9aa1ab;
          --blue:#00AEEF; --orange:#f97316; }
  .legal-page * { box-sizing:border-box; }
  .legal-page { background:var(--ink); color:var(--text);
         font:16.5px/1.75 -apple-system,'Segoe UI',system-ui,sans-serif; -webkit-font-smoothing:antialiased; }
  .legal-page .wrap { max-width:780px; margin:0 auto; padding:0 28px; }
  .legal-page a { color:var(--blue); }
  .legal-page header.site { border-bottom:1px solid var(--line); }
  .legal-page .navbar { max-width:1100px; margin:0 auto; padding:18px 28px; display:flex; align-items:center; gap:34px; }
  .legal-page .brand { display:flex; align-items:center; gap:12px; text-decoration:none; color:var(--text); }
  .legal-page .brand img { width:34px; height:34px; }
  .legal-page .brand span { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:.14em; }
  .legal-page nav.main { display:flex; gap:26px; margin-left:auto; }
  .legal-page nav.main a { color:var(--muted); text-decoration:none; font-size:14.5px; }
  .legal-page nav.main a:hover { color:var(--text); }
  .legal-page .pill { border-radius:30px; background:#fff; color:#0b0c0e; font-weight:600;
          padding:11px 22px; text-decoration:none; font-size:14.5px; white-space:nowrap; }
  .legal-page .docmark { display:flex; align-items:center; gap:12px; margin:64px 0 26px; }
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
  .legal-page footer.site { border-top:1px solid var(--line); padding:34px 0 54px; color:var(--muted); font-size:14px; margin-top:40px; }
  .legal-page footer.site .row { max-width:1100px; margin:0 auto; padding:0 28px; display:flex; flex-wrap:wrap; gap:20px; }
  .legal-page footer.site .grow { flex:1; }
  .legal-page footer.site a { color:var(--muted); text-decoration:none; }
  .legal-page footer.site a:hover { color:var(--text); }
  .smm-burger { display:none; flex-direction:column; justify-content:center;
    gap:5px; width:38px; height:38px; background:transparent; border:0; cursor:pointer; padding:0; }
  .smm-burger span { display:block; width:22px; height:2px; background:var(--text); border-radius:2px; }
  .smm-mobile-menu { position:fixed; inset:0; top:71px; z-index:40;
    background:rgba(11,12,14,.98); backdrop-filter:blur(12px);
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:26px; }
  .smm-mobile-menu a { color:var(--muted); text-decoration:none; font-size:19px; font-weight:600; }
  .smm-mobile-menu a.on { color:var(--orange); }
  .smm-mobile-menu a.pill { color:#0b0c0e; background:#fff; border-radius:30px; padding:13px 30px; font-size:15px; }
  @media (max-width:860px) { .legal-page nav.main { display:none; } .smm-burger { display:flex; } }
      `}</style>

      <div className="legal-page">
        <header className="site">
          <div className="navbar">
            <a className="brand" href="/"><img src="/images/logo-mark.webp" alt="Slate Cinema" /><span>SLATE CINEMA</span></a>
            <nav className="main">
              <a href="/">Home</a><a href="/portfolio">Portfolio</a>
              <a href="/social-media-management">Social Media</a>
              <a href="/how-it-works">How It Works</a>
            </nav>
            <a className="pill" href="/schedule-a-call">Schedule Call</a>
            <SMMMobileNav />
          </div>
        </header>

        <div className="wrap doc">
          <div className="docmark"><img src="/images/logo-mark.webp" alt="Slate Cinema app icon" /><span>SLATE CINEMA</span></div>
          <h1>Terms of Service</h1>
          <p className="dateline">Last updated · 6 August 2026</p>

          <p>These terms govern use of the Slate Cinema social media management service and the publishing
          platform that supports it (&ldquo;the Service&rdquo;). The Service is provided by Slate Cinema Inc (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) to client businesses (&ldquo;you&rdquo;) that engage us under a service agreement.</p>

          <h2>What the Service does</h2>
          <p>The Service lets a client business plan social media content on a shared calendar, route it
          through an approval step, publish it to the client&apos;s own connected accounts on Instagram,
          Facebook, TikTok, YouTube and X, and see the performance of what was published. Each client
          business has its own workspace and its own connected accounts.</p>

          <h2>Becoming a customer</h2>
          <p>Access is arranged through onboarding rather than instant self-serve signup. A business
          enquires, we agree scope and pricing, and the business then connects its own social accounts to
          its workspace. Enquiries: <a href="mailto:info@slatecinema.com">info@slatecinema.com</a>.</p>

          <h2>Authorization</h2>
          <p>We publish only to accounts whose owner has explicitly connected them through the platform&apos;s
          own authorization flow. Connecting an account confirms that you own it or are authorized to act
          for its owner. Authorization can be withdrawn at any time from your platform settings or by
          asking us, and we stop publishing to that account immediately.</p>

          <h2>Approval and responsibility for content</h2>
          <p>No content is published without an approval recorded against a named person. You are
          responsible for the accuracy and legality of content you supply or approve, and for the rights,
          licences and permissions needed for the media, music, footage and people appearing in it. We are
          responsible for publishing what was approved, to the account it was approved for, at the time it
          was scheduled.</p>

          <h2>Acceptable use</h2>
          <p>The Service may not be used to publish content that is unlawful, infringing, deceptive,
          harassing, or that violates the rules of the destination platform. We may refuse or remove
          content that in our judgment breaches these terms or a platform&apos;s policies.</p>

          <h2>Platform rules</h2>
          <p>Publishing through the Service is also subject to the terms of each destination platform,
          including Instagram, Facebook, TikTok, YouTube and X. Platform features, limits and availability
          are controlled by those platforms and may change without notice. We are not responsible for
          platform outages, rejections, rate limits, or changes to their APIs.</p>

          <h2>Service availability</h2>
          <p>We aim to publish scheduled content on time but do not guarantee uninterrupted service.
          Scheduled posts may be delayed or fail due to platform errors, media processing problems, or
          connectivity issues. Where a post fails we record the error and notify the operator so it can be
          retried.</p>

          <h2>Data</h2>
          <p>Our handling of content, tokens and statistics is described in our Privacy Policy at{' '}
          <a href="https://slatecinema.com/privacy-policy">https://slatecinema.com/privacy-policy</a>.</p>

          <h2>Termination</h2>
          <p>Either party may end use of the Service at any time. On termination we stop publishing, and
          stored content, tokens and records are deleted on request as described in the Privacy Policy.</p>

          <h2>Liability</h2>
          <p>The Service is provided on an &ldquo;as is&rdquo; basis to the extent permitted by law. Our liability
          arising from use of the Service is limited to the fees paid for the affected service in the three
          months preceding the claim. Nothing in these terms limits liability that cannot be limited by
          law.</p>

          <h2>Changes</h2>
          <p>We may update these terms; the date above will change and connected account owners will be
          notified by email of material changes.</p>

          <h2>Contact</h2>
          <p>Slate Cinema Inc, 10800 Biscayne Blvd Ste 420, Miami, FL 33161, United States<br />
          Email: <a href="mailto:info@slatecinema.com">info@slatecinema.com</a><br />
          Web: <a href="https://slatecinema.com">slatecinema.com</a></p>
        </div>

        <footer className="site">
          <div className="row">
            <span>© 2026 Slate Cinema Inc.</span>
            <span className="grow" />
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
          </div>
        </footer>
      </div>
    </>
  )
}
