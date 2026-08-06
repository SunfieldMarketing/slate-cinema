# Slate Cinema → Payload CMS 3 Migration — Phase 0 Inventory

Compiled by crawling the actual codebase (`D:\Downloads\slate-cinema-github`, branch `jake-slack-feedback-and-transcript-items` @ `31e30bf`) — not the deployed production site, since production is currently several commits behind this branch (the Jake feedback fixes haven't been merged yet). Once that PR merges, production and this branch will match.

**Per the playbook: this is Phase 0 only. No Payload code has been written. Confirm this before Phase 1 starts.**

---

## ⚠️ Most important finding — read this first

**None of the site's three lead-capture mechanisms currently deliver a lead anywhere.** All three only fire a PostHog analytics event and flip local UI state to "success" — there is no email, CRM, webhook, or database write on submit:

| Form | Location | On submit, actually does |
|---|---|---|
| Lead form ("Drop us a line") | `/contact#lead-form` | `posthog.capture('lead_form_submitted')` + shows a "Thanks" message. Nothing sent anywhere. |
| Project intake brief | `/contact/project` (embeds `public/intake.html`) | Checked the bundled file directly for any submission endpoint — it contains **zero** external URLs besides Google Fonts. Fully self-contained, no backend wired at all. |
| Schedule-a-call calendar | `/schedule-a-call` | "Confirm Time" button: `posthog.capture('call_booking_confirmed')` only. No real calendar/booking backend — the date/time grid is static, not a live calendar integration. |

This isn't something the CMS migration fixes by itself (per the playbook, Phase 3 only makes a form's *copy* editable and *mirrors* submissions into Payload — it explicitly does not touch submit logic). Worth deciding separately, ideally before or alongside this migration, whether real submission destinations (email/CRM/webhook) get wired up — right now every "Get Started" click on the live site is going nowhere.

Not fixing this now — flagging it per the playbook's own rule (report what's broken, don't silently fix it).

---

## Pages

| Route | Type | In nav? | In footer? |
|---|---|---|---|
| `/` | Static | ✅ Home | — |
| `/portfolio` | Static | ✅ Portfolio dropdown → "All Work" | ✅ Work |
| `/portfolio/[industry]` ×9 | SSG (`generateStaticParams`) | ✅ Portfolio dropdown (each industry) | — |
| `/how-it-works` | Static | ✅ | ✅ |
| `/journal` | Static | — (removed from nav in the fixes branch) | ✅ |
| `/journal/[slug]` ×6 | SSG | — | — (reached via `/journal`) |
| `/contact` | Static | ✅ "Contact Us" → `/contact#get-started` | ✅ "Get Started" |
| `/contact/project` | Static (embeds `intake.html`) | — (reached via Contact page's "Know What You Need" card) | — |
| `/schedule-a-call` | Static | ✅ "Schedule Call" (nav CTA button) | — |
| `/sitemap.xml`, `/robots.txt` | Generated (`sitemap.ts`, `robots.ts`) | — | — |
| `/_not-found` (404) | Default Next.js, not customized | — | — |

**Placeholder / non-functional links found (not real pages):**
- Nav "Client Portal" → `href="#"` (dead link)
- Footer "Privacy" and "Terms" → both `href="#"` (dead links, no actual legal pages exist)

Industry slugs (9): `ai`, `athletics`, `travel`, `real-estate`, `healthcare`, `products`, `corporate`, `organizations`, `education`

Journal slugs (6): `first-three-seconds`, `anatomy-of-a-scroll-stopping-ad`, `storytelling-vs-selling`, +3 more (see `src/lib/journal.ts`)

---

## Reusable globals

| Global | Source | Notes |
|---|---|---|
| **Navigation** | `src/components/Nav.tsx` | 3 static links + Portfolio dropdown (dynamically built from the industries list) + 1 CTA button + mobile overlay (mirrors desktop) |
| **Footer** | `src/components/Footer.tsx` | Marquee strip, wordmark watermark, CTA + newsletter form, "Studio" link column, bottom bar (copyright, dead Privacy/Terms links, Client Portal), 3D-model attribution line |
| **SEO defaults** | `src/app/layout.tsx` | Title template (`%s | Slate Cinema`), default description, OG/Twitter cards, `ProfessionalService` JSON-LD schema (just added) |
| **Site-wide banner** | None exists | — |
| **Ambient backdrop** | `src/components/ui/AmbientBackdrop.tsx` | Rendered per-page, not truly global content, but same component everywhere — likely code, not CMS data |

---

## Per-page block inventory

**`/` (home)** — `src/app/page.tsx`
1. Hero (video background, animated wordmark, "REC" HUD, CTA)
2. TrustSection (Meta/Alo/B&H flagship logos + client marquee)
3. Pipeline (4-phase interactive accordion, reused component)
4. PortfolioCarousel (3D drag carousel, "reel", opens ProjectCardModal)
5. Results (animated view/like/comment counters, full-screen pinned)
6. Reviews (3 curated testimonials + 3 video testimonials, reused component)
7. FinalCTA ("Your next era starts here")
8. Footer

**`/how-it-works`** — `src/app/how-it-works/page.tsx`
1. StoryboardHero (3D scroll-scrubbed scene — corkboard/clapperboard/workstation/phone models; see Visual/Motion section)
2. ProcessOverview ("Four phases, start to finish" — connector line + 4 labels)
3. Pipeline (same reused component as home)
4. BehindTheScenes
5. ProcessWalkthrough (sticky-scroll video reveal, 4 phases)
6. StatsBand (4 animated stat counters)
7. Guarantees (4 badge row)
8. FinalCTA (reused)
9. Footer

**`/portfolio`** — `src/components/PortfolioPageContent.tsx`
1. Hero
2. ThreeDPhotoCarousel (same drag-carousel pattern as home)
3. Industry-routing wheel/grid
4. FinalCTA (reused)
5. Footer

**`/portfolio/[industry]`** — `src/components/IndustryPageContent.tsx`
1. Scroll-scrubbed frame-sequence hero (shared placeholder clip across all 9 industries currently)
2. IndustryVideoTestimonials (only the flagship industry has real ones today)
3. Service bento cards (per-industry `serviceCards` array)
4. Stats row (per-industry)
5. MidCtaBand
6. FinalCTA (reused)
7. Footer

**`/journal`** — blog index, cards pulling from `journalPosts` array
**`/journal/[slug]`** — post detail, renders `JournalBlock[]` (types: `p`, `h2`, `quote`, `list`)

**`/contact`** — `src/components/ContactPageContent.tsx`
1. PageHero ("Let's get you started")
2. WhatHappensNext (4-step "what happens next")
3. StageRouter (3-card "what stage are you at" router — id=`get-started`)
4. LeadForm ("Drop us a line" — id=`lead-form`)
5. ReadyToTalk ("Book a time on our calendar" teaser → links to `/schedule-a-call`)
6. IntakeCTABand
7. ContactMethods ("Real Humans. Real Work." — email/phone/studio cards, "Handled With Care" badge)
8. StudioLocation (Google Maps embed + studio hours)
9. Footer

**`/contact/project`** — Nav + contained iframe embedding `public/intake.html` (self-contained bundled app, not a React component — see note above)

**`/schedule-a-call`** — `src/app/schedule-a-call/page.tsx`
1. PageHero ("Let's talk it through")
2. CallFraming ("Book a time on our calendar" — same framing pattern as Contact's ReadyToTalk, added per this round's fixes)
3. CustomCalendar (static date/time picker — not a live calendar integration, see finding above)
4. IntakeCTABand
5. Footer

---

## Forms

| Form | Fields | Submits to |
|---|---|---|
| Lead form (Contact) | Name*, Email*, Phone*, Company, Message | **Nothing** — PostHog event only (see finding above) |
| Project intake (`intake.html`) | Multi-step brief (goals/timeline/budget/etc. — bundled, not inspected field-by-field since it's a delivered external file) | **Nothing** — no endpoint found in the file |
| Schedule-a-call | Date + time selection | **Nothing** — PostHog event only, no real calendar |
| Newsletter (Footer) | Email | **Nothing** — PostHog event only |

---

## Dynamic / repeatable content

| Content type | Source | Fields |
|---|---|---|
| Portfolio projects | `src/lib/portfolio-projects.ts` | title, category, company, url (poster image), copy, metrics[], video? — **⚠️ currently placeholder/demo data** ("Neon Nights" / "HyperDrive Motors" / fabricated metrics like "4.2M views") — flagging per the playbook's fidelity rule, not changing it |
| Industries | `src/lib/industries.ts` | slug, label, icon, accent, hero copy, stats[], services[], serviceCards[], testimonial, videoTestimonials[] — the richest/largest data shape on the site |
| Journal posts | `src/lib/journal.ts` | slug, title, excerpt, category, accent, date, readTime, coverImage, author, content (block array) |
| Testimonials (home) | `src/components/Reviews.tsx` (inline array) | quote, name, role, company, rating — explicitly capped at 3 "curated per the client's own instruction" |

---

## Third-party scripts already present

| Service | Config | Notes |
|---|---|---|
| PostHog | `instrumentation-client.ts` → `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` (env var, currently **unset** — confirmed via console warning on every page load) | `api_host: /ingest` (proxied), `ui_host: us.posthog.com` |
| Google Maps | Inline iframe embed in `StudioLocation` (Contact page) | Hardcoded address query string, no API key needed for basic embed |
| Google Fonts | Referenced inside `intake.html` only | Not used by the main Next.js app (uses `next/font/google` instead) |

**Not present:** Google Analytics/gtag, Meta/Facebook pixel, any chat widget, any booking-calendar SaaS (Calendly etc.) — grepped the full codebase for `gtag`, `dataLayer`, `fbq(`, chat-widget patterns; none found.

---

## Visual / motion details easy to lose in migration

- **Custom cursor**: none present
- **Scroll animation libraries**: GSAP + ScrollTrigger (site-wide, primary), Lenis smooth-scroll (`SmoothScrolling.tsx`, wraps the whole app), Framer Motion (3D carousels only)
- **Canvas/WebGL**: `react-three-fiber` + `drei` — the `StoryboardHero` 3D scene on `/how-it-works` (corkboard, clapperboard, workstation, phone — 5 GLB models with Draco compression) is by far the most complex piece on the site and the highest-risk thing to preserve faithfully. This is hand-tuned scroll-choreography code (assembly/rotation/disassembly timing, anchor-part detection, mesh-level animation), not content — it should stay as code, not become CMS-driven, but the surrounding text overlays per beat (headline, service tags) could become editable fields without touching the 3D logic itself.
- **Video backgrounds**: Hero, PageHero, PageBackdrop (Contact/Schedule-a-call), IndustryPageContent hero — several with fade-mask/color-grade treatments that are CSS, not just a plain `<video>` tag
- **Counter/count-up animations**: `NumberTicker` component, used in StatsBand, PageHero stats, Results, CustomCalendar's "CLIENT RETENTION" readout
- **3D drag carousel**: custom pointer-event-based rotation physics (not Framer's built-in `drag`, deliberately rewritten per an earlier bug-fix commit) — used on Home, Portfolio

---

## Notes on current codebase state

- This branch (`jake-slack-feedback-and-transcript-items`) contains this round's fixes and is **not yet merged to master/production** (merge was blocked by Claude Code permissions — pending your decision).
- `portfolioProjects` data is clearly placeholder content, not real client work — worth deciding whether to migrate the placeholder data as-is (per the "faithful copy" rule) or have real project data ready before/during this migration.
