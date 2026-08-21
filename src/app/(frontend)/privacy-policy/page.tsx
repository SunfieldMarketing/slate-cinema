import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

/*
  Ported verbatim (design + copy) from the finished HTML Jake sent
  (privacy-policy.html) per the TikTok Content Posting API build brief.
  Copy is legally reviewed to ship as-is. See social-media-management/
  page.tsx's header comment for why the external font <link> and
  page-level favicon <link> from the raw file were dropped -- both are
  already global via next/font and the root layout's metadata, and for
  why the header now uses the real, shared <Nav /> instead of a
  hand-rolled one (2026-08-13, Kauan flagged the visual mismatch).
*/

export const metadata: Metadata = {
  description:
    'How Slate Cinema collects, uses, stores and protects data as part of its social media management service and publishing platform.',
}

export default function PrivacyPolicyPage() {
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

  /* TikTok requirement: app icon + wordmark in the page header, above the
     H1. Top margin cleared for the fixed shared Nav (see header comment). */
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
  .legal-page p strong, .legal-page li strong { color:var(--text); font-weight:600; }
  .legal-page ul { padding-left:22px; } .legal-page li { margin-bottom:10px; }
  .legal-page .doc { padding-bottom:40px; }
      `}</style>

      <div className="legal-page">
        <Nav />

        <div className="wrap doc">
          <div className="docmark"><img src="/images/logo-mark.webp" alt="Slate Cinema app icon" /><span>SLATE CINEMA</span></div>
          <h1>Privacy Policy</h1>
          <p className="dateline">Last updated · 6 August 2026</p>

          <p>Slate Cinema (&ldquo;we&rdquo;, &ldquo;us&rdquo;) provides social media management to client businesses. As part of
          that service we operate a publishing platform that a client uses to plan, review, approve and
          publish content to the client&apos;s own social media accounts. This policy explains what the platform
          collects, why, and how it is protected.</p>

          <h2>Who this policy covers</h2>
          <p>It covers the businesses that use our social media management service, the people at those
          businesses who connect and approve accounts, and our own staff who operate the platform alongside
          them. Each client business connects its own accounts and remains the owner of those accounts.</p>

          <h2>What we collect</h2>
          <ul>
            <li><strong>Connected account information.</strong> When an account owner authorizes the
            platform on a social network (Instagram, Facebook, TikTok, YouTube, X), we receive that
            account&apos;s identifier, username, profile picture and the access tokens the platform issues.</li>
            <li><strong>Content submitted for publishing.</strong> Videos, images, captions and scheduling
            details, supplied either by the account owner or by our team on the account owner&apos;s
            instruction.</li>
            <li><strong>Publishing and performance records.</strong> What was posted, when, who approved
            it, the resulting post link, and the performance statistics the platform reports back (views,
            reach, likes, comments, shares, saves).</li>
            <li><strong>Operational records.</strong> The name of the person who created and approved each
            post, kept as an audit trail so every published post traces to a named approval.</li>
          </ul>
          <p>We do not collect data about the followers or viewers of connected accounts beyond the
          aggregate statistics the platforms provide, and we do not buy, sell or rent personal
          information.</p>

          <h2>How we use it</h2>
          <p>Solely to operate the service: to publish approved content to the accounts that authorized us,
          to show scheduling and performance information to the account owner and our team, and to keep
          records of who approved what. We do not use this data for advertising or profiling, and we do not
          share it with third parties other than the platform the content is being published to.</p>

          <h2>Platform data</h2>
          <p>Access tokens and platform data are used only to perform the actions the account owner
          authorized. We follow the developer terms and policies of each platform, including the Instagram
          Platform Policy, the Facebook Platform Terms, the TikTok Developer Terms of Service, and the
          YouTube API Services Terms of Service. Use of YouTube API Services is also subject to the{' '}
          <a href="https://policies.google.com/privacy">Google Privacy Policy</a>.</p>
          <p>We do not display, republish or syndicate TikTok content on this website or anywhere else.
          TikTok access is used only to publish content the account owner approved, to that owner&apos;s own
          account.</p>

          <h2>Storage and security</h2>
          <p>Data is stored in a private database hosted by Supabase in the United States. Access tokens
          are held in an encrypted secrets vault, never in application code or ordinary database tables.
          Access is restricted to authorized Slate Cinema personnel and to the service processes that
          publish content. All transmission is encrypted over HTTPS/TLS.</p>

          <h2>Disconnecting and revoking access</h2>
          <p>An account owner may disconnect a connected account at any time, in the platform&apos;s own
          Connected Accounts settings or by asking us. Disconnecting revokes our access token immediately
          and we stop publishing to that account. Revoking access from the social network&apos;s own settings
          has the same effect.</p>

          <h2>Retention and deletion</h2>
          <p>Content and publishing records are retained while the account relationship is active and for
          up to 24 months afterwards for accounting and portfolio purposes. On request we delete the stored
          content, tokens and records for an account within 30 days, except where we are required to keep
          records by law. To request deletion, email{' '}
          <a href="mailto:info@slatecinema.com">info@slatecinema.com</a> with the account handle; we
          confirm in writing when it is done.</p>

          <h2>Your rights</h2>
          <p>Account owners may ask what we hold about their account, request a copy, request correction,
          or request deletion. Contact us using the details below and we will respond within 30 days.</p>

          <h2>Children</h2>
          <p>The service is used by businesses and their representatives and is not directed to anyone
          under 18.</p>

          <h2>Changes</h2>
          <p>If this policy changes materially we will update this page, change the date above, and notify
          connected account owners by email.</p>

          <h2>Contact</h2>
          <p>Data controller: Slate Cinema Inc, 10800 Biscayne Blvd Ste 420, Miami, FL 33161, United
          States<br />
          Email: <a href="mailto:info@slatecinema.com">info@slatecinema.com</a><br />
          Web: <a href="https://slatecinema.com">slatecinema.com</a></p>
        </div>

        <Footer />
      </div>
    </>
  )
}
