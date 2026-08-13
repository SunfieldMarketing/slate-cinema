# Slate Cinema — Project Context

Living reference doc. Read this first in any new session before touching code.
Companion to [`CMS_MIGRATION_PHASE0_INVENTORY.md`](./CMS_MIGRATION_PHASE0_INVENTORY.md)
(the CMS-migration field-by-field inventory) — this doc is the broader
project/business picture: who's who, what's deployed where, what the client
asked for on the Aug 2026 call, and current status of every ask.

Last updated: 2026-08-12.

## Who's who

- **Kauan** — the client. Email `kauan@sunfieldmarketing.com`. Owns Slate
  Cinema (a video production / content studio) and its sister brand
  **WaveCare** (healthcare marketing, `wavecare.io` — a separate codebase,
  not in this repo).
- **Jake (Kamensky)** — the developer who builds both Slate Cinema and
  WaveCare. In this session, I (Claude) am doing Jake's dev work on the
  Slate Cinema codebase specifically.
- **"Levy"** — third party who previously wired WaveCare's forms/calendar to
  Go High Level (GHL) via webhook. Jake mentioned texting Levy for the exact
  setup steps to replicate for Slate Cinema.

## Repo / deploy topology

- Working copy: `D:\Downloads\slate-cinema-github` (this is the real repo —
  **not** `D:\Downloads\slate-cinema-master`, a stale/unrelated older copy
  living next to it; don't confuse the two).
- GitHub: `SunfieldMarketing/slate-cinema`. Active branch: `cms-migration-phase0`
  (PR #3, open, unmerged into `master`). **Never merge/push to `master`
  without a fresh explicit go-ahead each time** — standing rule, previously
  declined once, still in force.
- A sibling branch `jake-slack-feedback-and-transcript-items` exists,
  forked from `master` at the same point as `cms-migration-phase0` but
  **predates the Payload CMS migration** — it deletes the entire CMS layer
  and restructures routes. It addresses an *earlier* (Aug 3) call/Slack
  feedback round, is now superseded, and must **not** be merged or
  cherry-picked from (would nuke the CMS). Left untouched, informational only.
- Vercel project auto-deploys `cms-migration-phase0` on every push as a
  **preview** (its "Production Branch" setting is still `master`). To push
  a build live to `https://slate-cinema.vercel.app`, manually promote via
  the Vercel REST API (`POST /v13/deployments?forceNew=1` with
  `target:"production"`, then poll until `READY`) — the `vercel` CLI fails
  auth with this token type. **Ask before promoting to production** each
  time; pushing to the branch itself is fine without asking.
- Preview and production deployments share the same live Turso DB (no
  separate staging database) — editing content via `/admin` on either URL
  mutates the one real dataset immediately, independent of which build is
  promoted to "production."

## Stack

Payload CMS 3 on Next.js 16.2.6 App Router. `@payloadcms/db-sqlite` pointed
at a Turso `libsql://` URL. `@payloadcms/storage-vercel-blob` for media.
`@payloadcms/plugin-form-builder` (`forms` + `form-submissions` collections).
Admin login: `admin` / `Hollywood@2026`.

Known environment quirks (Windows + Node 24 + tsx): `payload generate:types`
and `payload generate:importmap` both throw `T.registerHooks is not a
function`. Workaround used successfully multiple times: hand-patch the
generated file (`src/payload-types.ts`, `.../admin/importMap.js`) directly,
following the exact shape of existing entries, then verify with `npm run build`.

## What changed this session (2026-08-12 pass)

All on `cms-migration-phase0`, not yet pushed/promoted as of this writing.
See the "Client changelog" section (bottom) for the plain-English version.

| # | Change | File(s) |
|---|---|---|
| 1 | Fixed `.legal-page :root {}` / `.smm-page :root {}` — an invalid CSS selector (`:root` can never be a descendant of a `<div>`) that meant none of those pages' color variables ever applied, causing illegible/mismatched text color | `privacy-policy/page.tsx`, `terms-of-service/page.tsx`, `social-media-management/page.tsx` |
| 2 | Removed "Journal" from the 3 new pages' own hardcoded nav (main site nav keeps it) | same 3 files |
| 3 | Client Portal links → `https://my.slatecinema.com/`, opens in new tab | `globals/Navigation.ts`, `globals/Footer.ts`, `components/Nav.tsx`, `components/Footer.tsx`, `seed/index.ts` |
| 4 | Portfolio nav dropdown no longer has an inner scrollbar (was capped `max-h-72`, 9 industries need ~360px) | `components/Nav.tsx` |
| 5 | Removed "Watch the work" secondary CTA from industry page heroes | `components/IndustryPageContent.tsx` |
| 6 | Removed "scrubbed by scroll" phrase from industry pages' How It Works heading | `components/IndustryProcess.tsx` |
| 7 | Removed category filter chips + per-card category tag from Portfolio grid (used on `/portfolio` and every industry page's gallery) | `components/Portfolio.tsx`, `components/PortfolioPageContent.tsx`, `globals/PortfolioIndexPage.ts` (field hidden from admin, not deleted — avoids a DB migration) |
| 8 | "Replies within one business day" → "Replies within minutes" (reply/acknowledgment copy only — left the *Discovery Call* and *"1-Day Response" full plan* copy alone since those promise a different, genuinely-longer deliverable) | `components/FinalCTA.tsx`, `globals/FinalCTA.ts`, `components/ContactPageContent.tsx`, `globals/ContactPage.ts`, `components/IndustryFaq.tsx`, `app/(frontend)/contact/page.tsx`, `seed/index.ts` |
| 9 | Footer marquee: expanded 3 → 20 phrases. Root cause of the "drops off / not a perfect loop" complaint: the loop math (`xPercent:-50` over a 2x-duplicated list) is only seamless if the duplicated content is wider than the viewport — with only 3 short items it wasn't, so the tail ran out and showed a blank gap right before snapping back | `seed/index.ts` (`marqueeItems`) |
| 10 | Fixed Lead/Booking/Newsletter forms silently failing to save to the CMS: the auto-created `forms` doc used `confirmationType:'message'` but never supplied the plugin's required `confirmationMessage` richText, so `payload.create` threw a 400 that was caught and swallowed (frontend always showed success regardless) | `app/api/lead/route.ts`, `app/api/booking/route.ts`, `app/api/newsletter/route.ts`, new `lib/simple-richtext.ts` helper |
| 11 | Social Media Management hero H1 was capped at `max-width:16ch` (~16 characters wide), forcing 6 short lines; removed the cap so it wraps across the real container width (~3 lines) | `app/(frontend)/social-media-management/page.tsx` |

Verified: `npm run build` passes clean after all of the above.

**Still needs a live-DB content update** (code fallbacks are correct, but
these Global docs already exist in the live Turso DB with the old literal
values, so the code `defaultValue` won't retroactively apply — must be
edited through `/admin` directly, or the specific doc re-saved): Navigation
→ Client Portal Href, Footer → Bottom Bar → Client Portal Href, Footer →
Marquee Items (still only has the original 3 rows live), Final CTA → Trust
Note, Contact Page → Hero Subtitle, Contact Page's lead-form badges +
success message.

## The Aug 2026 call transcript — full action-item breakdown

Otter.ai transcript of a call between Jake and Kauan covered **both** Slate
Cinema and WaveCare. WaveCare items are called out and explicitly excluded
below — I have no repo access to it this session.

### Slate Cinema items (typed instruction + transcript, deduplicated)

| Item | Status | Notes |
|---|---|---|
| New-page text color = background | ✅ Done | Root cause found: invalid CSS selector, see change #1 above |
| Client Portal → my.slatecinema.com | ✅ Done | Change #3 |
| Dropdown menu longer, no scroll | ✅ Done | Change #4 |
| Remove "Watch the work" on industry heroes | ✅ Done | Change #5 |
| Remove "scrub by scroll" text | ✅ Done | Change #6 |
| Remove subcategories/filters on portfolio + gallery | ✅ Done | Change #7 |
| "Replies within minutes" wording | ✅ Done | Change #8 |
| Fix navbar on new pages (remove Journal) | ✅ Done | Change #2 |
| Connect lead forms + calendar to GHL | ⛔ **Blocked** | No GHL API key / webhook URL / calendar embed code provided yet. Need: (a) GHL webhook URL(s) or API key + location ID, (b) whether to keep the custom-built Lead Form/Calendar UI and just POST to GHL on submit, or switch to embedding GHL's own calendar widget outright. Baseline Payload-side bug (forms silently failing) fixed independently either way — see change #10. |
| Optimize page speed/size: photos → WebP, videos optimized but instant-loading | ⛔ **Blocked** | Need a decision: keep the just-stabilized Vercel Blob pipeline (debugged extensively this session, currently working) vs. move video hosting to AWS S3 or Vimeo, per the transcript's discussion of a thumbnail-first/click-to-load pattern for non-hero videos. This is a real architecture change with cost implications — needs the client's call. WebP conversion itself can proceed independent of the hosting decision. |
| "Ad management page" text-wrap → 3 lines | ✅ Done, pending confirmation | Slate Cinema has no page literally named "Ad Management" — WaveCare has one, but that's a different codebase. Strong match to the transcript's explicit discussion of the *Social Media Management* page's H1 (6 lines → "I think three lines could be good"), so I fixed that one (change #11). Flag if this was actually meant for WaveCare. |
| Footer marquee loop / more words | ✅ Done | Change #9 |
| Meta Pixel | ⛔ **Blocked** | Client confirmed on the call they haven't provided one yet ("we'll probably have to get that"). Need the Pixel ID. |
| Mobile responsiveness pass | 🔲 Not started | Jake mentioned doing this separately; worth a dedicated audit pass if wanted. |
| Vercel project transfer to the Slate team | 🔲 Not mine to do | Account/ownership change — Jake's own admin action per the transcript, and account-settings changes need explicit user go-ahead regardless. |
| DNS cutover (slatecinema.com root/www → Vercel) | 🔲 Not mine to do | Registrar/DNS-level, happened outside this codebase during the call itself. |
| PostHog / SEO schema / sitemap / llms.txt | ✅ Already done | From earlier in this migration — worth a final confirm-it's-still-live pass. |
| Hero scroll video swap | 🔲 Awaiting asset | Client offered to supply new hero footage; current hero is a manually frame-wired sequence, not admin-editable — would need hand-wiring once a new video is provided. Not an admin/CMS gap to "fix," just a limitation to know about. |
| Invoice / payment discussion | N/A | Business matter between Jake and Kauan, no system access, not a coding task. |

### WaveCare items mentioned in the transcript (out of scope here)

Ad management formatting, a dropdown not displaying text correctly, number
formatting issues, the WaveCare contact-form/DNS troubleshooting saga,
"Book a Demo" button. None of these are actionable from this session — no
WaveCare repo access. Flag if any of these were actually meant for Slate
Cinema instead.

## Known limitations / things intentionally left alone

- `public/intake.html` (the `/contact/project` embedded 7-step form) has
  **zero submission mechanism** — no fetch, no `postMessage`, nothing.
  Data entered there currently goes nowhere. It's a 1.8MB minified bundle
  kept byte-identical to a delivered file per an earlier commit's own
  stated rationale — too risky to hand-patch blind. Needs a decision: (a)
  sign-off to attempt a careful patch, (b) rebuild natively in React so
  it's CMS/GHL-wireable, or (c) confirm out of scope for now.
- Hero video is a hand-wired frame sequence, not swappable via the admin —
  see "Hero scroll video swap" above.

## Mobile audit (2026-08-12)

Swept every route at 375px width (home, portfolio + all 9 industries,
contact, contact/project including the intake iframe's own document,
schedule-a-call, how-it-works, journal + a post, privacy-policy,
terms-of-service, social-media-management) checking for horizontal
overflow / off-viewport content via a scripted DOM check, not just
visual inspection. All clean except one real fix: CustomCalendar's
date-picker buttons were rendering ~30x22px (aspect-square sized purely
by a 7-column grid track) -- added `min-h-9 min-w-9` so they hold a
real tap-target floor regardless of track width.

Also chased down what looked like a severe finding -- the homepage
hero's CTA buttons and headline letters appearing permanently stuck at
their GSAP entrance-animation "from" state (invisible / off-screen) on
mobile -- and traced it to the test browser's tab not being focused
(`document.visibilityState:"hidden"`), which throttles
`requestAnimationFrame` site-wide; reproduced identically at desktop
width, which rules out anything mobile-specific. Not a real bug.
**Caveat for future sessions**: this harness's automated Browser pane
cannot reliably test rAF/GSAP-driven entrance animations for this
reason -- structural checks (overflow, computed sizing) remain valid,
but don't trust an animation-dependent finding without also reproducing
it at a different viewport width to rule out the focus/rAF artifact.

## Deploy status (2026-08-12, end of session)

Production (`slate-cinema.vercel.app`, commit `73d1cf5`) is **4 commits
behind** everything in this doc's "What changed" table. All of it is
pushed to `cms-migration-phase0` and builds clean as a preview, but
nothing here is visible to real visitors or Kauan until promoted.
Deployment protection blocks direct browsing of preview URLs (Vercel
SSO wall) -- verification for this batch was done via local build +
local dev server network checks instead (see each commit message for
specifics), plus confirming zero new entries in Vercel's runtime error
log for the preview environment.

**Major finding this pass**: `public/intake.html` already has a real,
working GHL webhook wired into its bundled app code (`sendToGHL` /
`WEBHOOK_URL` in the file's `__bundler/manifest`-packed JS, pointing at
`services.leadconnectorhq.com`) -- missed on an earlier pass because
that pass grepped the file's raw packed text instead of unpacking its
custom bundler format first. Left it completely untouched; added a
same-origin fetch-interception mirror (`IntakeFrame.tsx` + `/api/intake`)
so submissions also land in Payload, without altering the original GHL
delivery at all. Have NOT test-fired the real webhook (a `curl` test was
blocked by the sandbox for exactly this reason -- it's a live third-party
automation endpoint, and test data could trigger real side effects on
Kauan's GHL account without his knowledge). Confirm with Kauan whether
that webhook is still the intended destination before relying on it.

## Schedule a Call: now collects contact info (2026-08-12)

CustomCalendar previously only captured date + time. Client decision:
keep the current custom design (don't switch to a GHL embed) but add a
step to collect name/email/phone before the booking confirms. Done --
see commit 578789e. `/api/booking` now requires and mirrors all 5
fields, and forwards them to `GHL_BOOKING_WEBHOOK_URL`.

## Decisions resolved (2026-08-12, follow-up)

- **Calendar**: confirmed — keep the custom design as the frontend
  (already done, commit 578789e), GHL is backend-only via
  `GHL_BOOKING_WEBHOOK_URL`. The audit doc's "replace with GHL's
  embedded widget" suggestion does NOT apply; no change needed.
- **Meta / Alo / B&H logos**: confirmed real, already correctly on
  the site. No action needed.
- Still open: TNR keep-or-retire, Podcasts page guest names/channel
  URLs sign-off. Proceeding with the portfolio/industry-page content
  rebuild using the doc's real client data; TNR-dependent sections use
  the doc's own "if TNR doesn't come back" fallback anchors.

## Content-integrity audit (2026-08-12, via shared Google Doc "Slate/Wave web edits 27")

A client-shared audit doc revealed the site's testimonials, portfolio
case studies, and several stats are **fabricated demo content** left
over from the original template build, not real Slate Cinema work.
Fixed what's safe (see commit ed276b1): removed fabricated named
testimonials (Priya Sharma/Nimbus Systems, Marcus Webb/Voltbrew, Elena
Ruiz/Nordform, etc. -- real Google review testimonials in Reviews.tsx
are unaffected), swapped unsourced stats for sourced ones, fixed
NumberTicker rendering "0" server-side (no-JS/SEO bug), added 9 of 10
missing 301 redirects, WaveCare->Wavecare spelling, and several copy
fixes. Synced the equivalent live-DB content (Pipeline global's
post-production category, HowItWorksPage statsBand, Footer newsletter
sentence) directly via the admin API so it took effect immediately.

**NOT done, explicitly flagged rather than guessed at:**
- **The entire portfolio grid is also fabricated** (8 template case
  studies -- Neon Nights/HyperDrive Motors, Velocity/Apex Athletics,
  etc. -- with invented metrics, repeated across Home/Portfolio/all 9
  industry pages). Did not remove it: no real replacement media is
  available, and pulling it with nothing to replace it would make
  every page look broken rather than fixed. Needs real client work
  (videos/photos/case studies) before this can be swapped in.
- **Full industry-page rebuilds** per the doc's section-by-section
  plans (Education, Organizations, Real Estate, Hospitality,
  Animation, AI, new Podcasts page) -- large scope, real Vimeo
  links/client names given for several, but building 6+ new page
  structures needs real media and client sign-off, not attempted
  blind in one pass.
- **Schedule-a-call: direct conflict.** The audit doc says replace the
  custom calendar with GHL's embedded booking widget
  (`api.leadconnectorhq.com/widget/booking/nwrti66org5yO4mGWzb3`).
  This directly contradicts this session's own earlier instruction
  ("use the current calendar custom design system") which was already
  implemented (contact-info collection step, commit 578789e). Left
  the custom calendar as-is pending a decision on which one wins.
- **Meta/Alo/B&H logo wall** -- doc says "verify before keeping,"
  never confirmed either way.
- **TNR (The Next Ride) page** -- 404 on the new site, was the
  template for every other industry page's build plan, and the
  underlying business relationship ended in a collections dispute.
  Doc explicitly frames this as "decision needed" from Jake (keep TNR
  as flagship once cleared, or promote CVM Construction instead).
- **Real Talk podcast page** -- doc proposes a new /portfolio/podcasts
  page built around a real in-house show, but flags needing Jake's OK
  before publishing guest names + exact channel URLs.
- **/thank-you page + dataLayer event** for Google Ads conversion
  tracking after form submits -- doc flags this as pending from
  Kauan's 8/7 call, not built yet.
- Response-time messaging: audit says standardize to one promise
  site-wide. Aligned the "Avg. Response Time" stat framing, but left
  "1-Day Response" (custom execution plan) and "Discovery Call...
  within one business day" alone -- those describe a materially
  larger deliverable than an acknowledgment reply, and promising a
  full custom plan "within minutes" would be a real over-promise.
  Flagging the nuance rather than silently picking one.

## Client decisions (2026-08-12)

1. **GHL** — client wants a needs-list first, hasn't sent credentials yet.
   Still blocked; see the requirements list in the chat response this was
   asked in. Needed: webhook URL(s) or API key + location ID for the Lead
   Form and the Schedule-a-Call calendar; a call on custom-UI-plus-webhook
   vs. GHL's own embedded widgets.
2. **Video hosting** — CONFIRMED (2026-08-12, after being reopened when the
   call transcript surfaced a more specific AWS + thumbnail-first plan):
   keep Vercel Blob as-is. No re-platforming, no AWS migration. Final.
3. **"Ad management page"** — confirmed: Social Media Management page.
   Already fixed (change #11 above).
4. **Project Intake form** (`/contact/project`, `public/intake.html`) —
   client wants its backend connected to both the CMS and GHL. Since the
   file has zero submission mechanism and is a 1.8MB bundle too risky to
   patch blind, plan is to **rebuild it natively in React**, matching the
   current visual design, with a new `/api/intake` route mirroring the
   lead/booking/newsletter pattern (Payload `form-submissions` +
   `confirmationMessage` fix already proven there) plus a GHL-forward hook
   ready to activate once credentials arrive. Not started yet — sizable,
   scoped as its own task.
5. Meta Pixel ID — still needed, not yet provided.
6. Any Slate-vs-WaveCare mixups in the transcript items — none flagged yet.

## Images / WebP (2026-08-12 scoping)

537 JPG/PNG files under `public/` (~75MB total), only 5 already WebP.
Recommended approach over bulk static conversion + rewriting every `<img
src>`: migrate raw `<img>` tags to `next/image`, which negotiates
WebP/AVIF automatically per-browser and adds lazy loading + priority
hints for free — lower risk than hand-converting 537 files and safer than
a blanket format swap. Keep hero/above-fold media eager/`priority` so nothing
above the fold regresses on "loads instantly." Not started yet.

## Client changelog (plain-English, for sending to Kauan)

See the chat response this doc was written alongside for the current
draft — kept out of this file so it doesn't go stale here; regenerate from
the "What changed this session" table above when ready to send.
