import { randomBytes } from 'node:crypto'
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/*
  "Make every piece of site copy editable in the CMS" -- Jake's
  2026-09-24 handoff (#web-development) plus the rest of the hardcoded
  copy found auditing every page afterwards.

  Schema (all additive -- ADD COLUMN and brand-new tables only, so no
  table rebuilds and none of the cascade-delete risk described in this
  folder's README):
  - industries: display order, client strip (heading + `clients` array),
    service / timeline / gallery headings, the full-width statement
    moment, the mid-page CTA, and the sister-brand redirect (Healthcare ->
    Wavecare, previously special-cased by slug in code).
  - site_settings.labels_*: short labels repeated across pages (hero
    trust line, "Book a call", "Book this", "Most booked", ...).
  - navigation, footer, home_page, portfolio_index_page: the remaining
    typed-in labels and headings on those surfaces.
  - journal_page: new global -- /journal had no CMS document at all.
  Every column is mirrored on the matching `_<table>_v` version table.
  Column types/defaults are exactly what Payload's own schema push
  generates for the new config (diffed against a fresh pushed db).

  Data (so nothing visible changes on deploy):
  - ADD COLUMN ... DEFAULT fills every existing row (live + history) with
    the copy that was typed into the templates.
  - Per industry: display order matching today's menu order, the client
    cards and statement copy that were code-only in src/lib/industries.ts
    (snapshotted below, not imported, so this migration never changes
    meaning if that file does), and a service heading that matches the
    real card count ("Five ways it shows up" was on pages with four).
    Written to the live row and to the latest version row, so the admin
    form (which edits the latest version) shows the same values.
  - Client cards keep their Vimeo ID only when the old code had a real
    one. The rest come across without a video, which hides them -- per
    the handoff, a card with no Vimeo ID hides instead of looping a
    generic pipeline clip.
  - Podcasts becomes a real industries doc (it was the only code-only
    industry) and the Journal page global gets its first, published row.
    Both through the Local API with `_status: 'published'` in the data --
    `draft: false` alone leaves `_status` at its 'draft' default (see
    20260826_140000_publish_new_pages.ts).

  Idempotent like the other hand-written migrations here: duplicate
  columns and existing tables are tolerated, array rows are replaced
  rather than appended, and the create steps check for an existing row
  first.
*/

type MigrationDB = MigrateUpArgs['db']

function errorText(e: unknown): string {
  const err = e as { message?: unknown; cause?: { message?: unknown } } | null
  return [err, err?.message, err?.cause, err?.cause?.message].filter(Boolean).map(String).join(' | ')
}

async function addColumn(db: MigrationDB, table: string, column: string, definition: string) {
  try {
    await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD \`${column}\` ${definition};`))
  } catch (e) {
    if (!errorText(e).includes('duplicate column name')) throw e
  }
}

const q = (s: string) => `'${s.replace(/'/g, "''")}'`
const text = (dflt?: string) => (dflt === undefined ? 'text' : `text DEFAULT ${q(dflt)}`)

// [column, definition] -- added to the live table as-is and to its
// version table as `version_<column>`.
const COLUMNS: Record<string, [string, string][]> = {
  industries: [
    ['order', 'numeric DEFAULT 100'],
    ['section_eyebrow', text('Who We Shoot For')],
    ['section_headline', text()],
    ['section_headline_accent', text()],
    ['services_eyebrow', text('What We Make')],
    ['services_headline', text('Ways it shows up')],
    ['services_headline_accent', text('— pick yours.')],
    ['statement_eyebrow', text()],
    ['statement_headline', text()],
    ['statement_body', text()],
    ['statement_video', text()],
    ['cta_headline', text('Have a project like this in mind?')],
    ['cta_subhead', text('20 minutes, no pitch deck — just an honest read on scope, timeline and budget.')],
    ['cta_button_label', text('Get Started')],
    ['cta_button_href', text('/contact')],
    ['process_eyebrow', text('How It Works')],
    ['process_headline', text('The timeline,')],
    ['process_headline_accent', text('concept to distribution.')],
    ['gallery_eyebrow', text('Our Work')],
    ['gallery_headline', text('A Gallery of Impact')],
    ['redirect_enabled', 'integer DEFAULT false'],
    ['redirect_eyebrow', text()],
    ['redirect_headline', text()],
    ['redirect_body', text()],
    ['redirect_button_label', text()],
    ['redirect_url', text()],
  ],
  site_settings: [
    ['labels_trust_line', text('174+ projects since 2023 · Replies within minutes')],
    ['labels_get_started', text('Get Started')],
    ['labels_get_started_href', text('/contact')],
    ['labels_book_call', text('Book a call')],
    ['labels_book_this', text('Book this')],
    ['labels_most_booked', text('Most booked')],
    ['labels_view_full_portfolio', text('View Full Portfolio')],
    ['labels_start_project', text('Start a project like this')],
    ['labels_back_to_reel', text('Back to the reel')],
    ['labels_explore_industry', text('Explore {industry} Work')],
  ],
  navigation: [
    ['client_portal_label', text('Client Portal')],
    ['home_label', text('Home')],
    ['portfolio_label', text('Portfolio')],
    ['all_work_label', text('All Work')],
  ],
  footer: [
    ['wordmark', text('SLATE CINEMA')],
    ['sitemap_column_support_label', text('Support')],
    ['sitemap_column_support_href', text('/contact#get-started')],
    ['sitemap_column_privacy_label', text('Privacy Policy')],
    ['sitemap_column_terms_label', text('Terms of Service')],
    ['bottom_bar_copyright_name', text('Slate Cinema')],
    ['bottom_bar_privacy_label', text('Privacy')],
    ['bottom_bar_terms_label', text('Terms')],
    ['bottom_bar_client_portal_label', text('Client Portal')],
  ],
  home_page: [
    ['selected_work_eyebrow', text('Our Work')],
    ['selected_work_headline', text('Selected Work')],
    ['selected_work_subhead', text('Drag to spin the reel · click a frame to open it')],
    ['results_eyebrow', text('Our Clients This Month')],
    ['results_views_label', text('views')],
    ['results_reach_label', text('Reach')],
  ],
  portfolio_index_page: [
    ['gallery_eyebrow', text('Our Work')],
    ['gallery_headline', text('A Gallery of Impact')],
  ],
}

type ClientSeed = {
  name: string
  year: string
  description: string
  vimeoId?: string
  orientation?: 'feed'
}
type IndustrySeed = {
  clients: ClientSeed[]
  statement?: {
    eyebrow: string
    headline: string
    body: string
    video: string
  }
  redirect?: {
    eyebrow: string
    headline: string
    body: string
    buttonLabel: string
    url: string
  }
}

// Snapshot of the code-only content in src/lib/industries.ts as of this
// migration (clientShowcase + cinematicStatement), keyed by slug.
const INDUSTRY_SEED: Record<string, IndustrySeed> = {
  ai: {
    clients: [
      {
        name: 'Tremco CPG',
        year: '2026',
        description:
          "AI-augmented 3D explainer series built from the client's own DWG drawings — a national NYC building-code-change story, in production.",
      },
      {
        name: 'Anochi',
        year: '2024',
        description:
          'A VFX Eye video, part of a 5-part workshop series covering journey, accountability, breathwork and coaching.',
        vimeoId: '963219647',
      },
      {
        name: 'CVM Waste',
        year: '2025',
        description:
          'An animated logo and brand sting for a second brand launched from scratch alongside the CVM Construction rebuild.',
      },
      {
        name: 'Smash House Burgers',
        year: '2025',
        description:
          'Recurring animation stitches — the Trolley Problem series — built into a multi-location weekly social engine.',
      },
    ],
    statement: {
      eyebrow: 'AI In Service Of The Story',
      headline: 'Run by filmmakers,\nnot by prompts.',
      body: 'Every AI-accelerated frame still gets a human finishing pass — transcription-driven editing, generative b-roll, AI-assisted product photoshoots. Real production craft, just faster.',
      video: '963219647',
    },
  },
  athletics: {
    clients: [
      {
        name: 'Gotham Rugby',
        year: '2022',
        description:
          "Match-day coverage at Randall's Island, NYC — storytelling built from the thrill of live competition, not a highlight reel cut after the fact.",
        vimeoId: '862067416',
      },
      {
        name: 'Kids of Courage',
        year: '2018–2021',
        description:
          'Marathons filmed across the country — capturing the strength and joy of children with disabilities as they defy limits, nationwide.',
        vimeoId: '588692923',
      },
      {
        name: 'Camp Slapshots',
        year: '2023',
        description:
          'The thrill of sports paired with visual effects — an unforgettable experience built for a young, high-energy audience.',
        vimeoId: '863822136',
      },
      {
        name: 'APEX NYC',
        year: '2019',
        description:
          "Event highlight coverage from APEX Assembly's NYC gathering — full production detail still on file.",
        vimeoId: '399193884',
      },
    ],
    statement: {
      eyebrow: 'Why Speed Matters',
      headline: 'Content built for\npeople who scroll fast.',
      body: 'A hype reel has less than a second to earn the next second. Every cut, every beat, every frame is built around that one job — hold attention through the scroll, not just look good after it stops.',
      video: '862067416',
    },
  },
  travel: {
    clients: [
      {
        name: 'Sleepy Hollow Hotel',
        year: '2024',
        description:
          "Video and drone coverage of a landmark hotel property — AI virtual staging filled in wherever a space wasn't furniture-ready on shoot day.",
      },
      {
        name: 'Envision Festival',
        year: '2024',
        description:
          'Multi-day festival recap coverage in Costa Rica, turned around fast enough to still ride the post-event wave.',
        vimeoId: '932028681',
      },
      {
        name: 'Gateways',
        year: '5 yrs running',
        description:
          'Seasonal Passover program coverage for a nonprofit serving thousands of families, plus year-round event and brochure work.',
        vimeoId: '1174431950',
      },
      {
        name: 'Smash House Burgers',
        year: '2025',
        description:
          'A recurring social content engine across every location — comedy reels, menu drops, launches, every week.',
      },
    ],
    statement: {
      eyebrow: 'Sell The Feeling',
      headline: 'Not just the room —\nthe feeling of being there.',
      body: 'Cinema drones, golden-hour scheduling, a grade built to make a place feel like a memory before the viewer has even booked.',
      video: '932028681',
    },
  },
  'real-estate': {
    clients: [
      {
        name: 'CVM Construction',
        year: '2025',
        description:
          '150+ NYC building permits, top 5% of NY contractors — taken from zero web presence to a full brand system, plus a second brand (CVM Waste) built from scratch.',
      },
      {
        name: 'TruBlue of NW Brooklyn',
        year: '2025',
        description:
          '"Before Your Listing Photos, Fix These First" — concept-titled comedy reels aimed at homeowners and the realtors who list their homes.',
      },
      {
        name: 'Good Choice Realty',
        year: '2021',
        description:
          'A dynamic walkthrough and glamour tour built to move listings faster, from stunning aerials to immersive interiors.',
        vimeoId: '501888251',
      },
      {
        name: 'Offerman House',
        year: '2024',
        description: 'A Brooklyn luxury development, covered end to end.',
        vimeoId: '278155978',
      },
    ],
    statement: {
      eyebrow: 'Concept To Closing',
      headline: 'We shoot the blueprint,\nthe build, and the sale.',
      body: 'Real estate is the final step of construction — we run the timeline the same way: a blueprint, a build, and a finish, all cinematic.',
      video: '278155978',
    },
  },
  healthcare: {
    clients: [],
    redirect: {
      eyebrow: 'Sister Brand',
      headline: 'Want to see what our healthcare marketing does?',
      body: 'We operate under Wavecare, our sister brand.',
      buttonLabel: 'Visit Wavecare',
      url: 'https://wavecare.io',
    },
  },
  products: {
    clients: [
      {
        name: 'EIR NYC',
        year: '2024',
        description:
          'A full jewelry & skincare catalog — Cream, Earrings, Necklaces, Socks — shot and cut end to end as one coordinated product series.',
        vimeoId: '929671839',
      },
      {
        name: 'Alo Moves',
        year: '2023',
        description: "A vertical commercial cut built for the fitness platform's own product launch.",
        vimeoId: '862075818',
        orientation: 'feed',
      },
    ],
    statement: {
      eyebrow: 'Built To Convert',
      headline: 'Macro-lit,\nengineered to sell.',
      body: 'A signature grade and cuts built to sell in six seconds or less — engineered for conversion first, aesthetics second, though we rarely have to choose between the two.',
      video: '929671891',
    },
  },
  corporate: {
    clients: [
      {
        name: 'MPower',
        year: '2024',
        description: 'A recruiter video plus event recap, built to attract talent, not just document an event.',
        vimeoId: '936451661',
      },
      {
        name: 'QotaPro',
        year: '2025',
        description: 'Brand film work for a contractor-focused platform.',
      },
      {
        name: 'Skyline Capital',
        year: '2025',
        description: 'Executive-facing brand communications for a capital firm.',
      },
    ],
    statement: {
      eyebrow: 'People, Not Just Product',
      headline: 'The company behind\nthe company.',
      body: "Corporate content is where most brands get boring. We build films that make a company feel like the people inside it — because that's who prospects and candidates are actually deciding to trust.",
      video: '936453597',
    },
  },
  organizations: {
    clients: [
      {
        name: 'Gateways',
        year: '5 yrs running',
        description:
          'Seasonal Passover program coverage for a nonprofit serving thousands of families, plus year-round event and brochure work.',
        vimeoId: '1174431950',
      },
      {
        name: 'Chai Lifeline',
        year: '2025',
        description: 'Mission-driven storytelling for a nonprofit serving families in crisis.',
      },
      {
        name: 'HASC',
        year: '2025',
        description: 'Program and community coverage for a nonprofit serving people with disabilities.',
        vimeoId: '521940131',
      },
      {
        name: 'NCSY',
        year: '2025',
        description: 'Event and community-impact coverage for a national youth movement.',
      },
    ],
    statement: {
      eyebrow: 'Mission, Not Just Message',
      headline: 'Storytelling that moves\npeople to actually act.',
      body: 'Organizations is Slate’s deepest historic vertical. Mission-driven work needs to move people to actually do something — donate, volunteer, show up — shot with the same craft as any commercial campaign.',
      video: '363484201',
    },
  },
  education: {
    clients: [
      {
        name: 'Gateways',
        year: '5 yrs running',
        description:
          'Seasonal Passover program coverage for a nonprofit school community, running five years without a break.',
        vimeoId: '1174431950',
      },
      {
        name: 'HANC',
        year: '2023–2024',
        description:
          'Graduation, open house, acceptance, and color war coverage — real school-life storytelling, not stock footage.',
        vimeoId: '1198897231',
      },
      {
        name: 'Camp Mesorah',
        year: '2025',
        description: 'Weekly video coverage built into an ongoing camp content engine.',
        vimeoId: '855035069',
      },
    ],
    statement: {
      eyebrow: 'Show, Don’t Tell',
      headline: 'Help families see\nthemselves on campus.',
      body: 'Prospective students decide whether they can see themselves on a campus in the first few seconds of a video. We build the film that makes that decision easy.',
      video: '1198897231',
    },
  },
}

// Podcasts was the one industry that only existed in code (src/lib/
// industries.ts). Its media stays code-side for now: an empty upload on a
// doc whose slug matches a code entry falls back to that entry's files in
// src/lib/normalize.ts. Neither client has a Vimeo video yet, so its
// client strip stays hidden until one is added in /admin.
const PODCASTS_DOC = {
  slug: 'podcasts',
  label: 'Podcasts',
  icon: 'Mic' as const,
  accent: '#00AEEF',
  blurb:
    'Podcast production as a service, proven on our own show — Real Talk (15 episodes, every Sunday) and World Within.',
  description:
    'Podcast production as a service, proven on our own show every single week — full episode, three concept-titled reels, thumbnails, captions and carousels, on a real release calendar. Set design, multi-cam filming, and editing run the way an in-house team would run it, for your show instead of ours.',
  stat: 'Real Talk · World Within',
  stats: [
    {
      value: 15,
      suffix: '',
      label: 'Real Talk Episodes, S1',
    },
    {
      value: 31,
      suffix: '',
      label: 'Clips From One Episode',
    },
    {
      value: 3,
      suffix: '',
      label: 'Reels Shipped Every Week',
    },
    {
      value: 5,
      suffix: '.0',
      label: 'Google Rating',
    },
  ],
  services: [
    {
      name: 'Set design + studio build',
    },
    {
      name: 'Multi-cam filming',
    },
    {
      name: 'Full-episode edit',
    },
    {
      name: 'Distribution-ready exports',
    },
  ],
  serviceCards: [
    {
      title: 'Set Design + Studio Build',
      description: 'We designed and built the physical set the show is recorded on — a studio, not a rented room.',
      outcome: 'Real studio, not a background',
      deliverables: [
        {
          item: 'Set design',
        },
        {
          item: 'Studio build-out',
        },
        {
          item: 'Lighting + camera plan',
        },
      ],
      meta: 'One-time build · ongoing use',
      featured: true,
    },
    {
      title: 'Multi-Cam Filming',
      description: 'Dedicated per-guest audio, cut multi-camera for a real broadcast feel.',
      outcome: 'Broadcast-quality capture',
      deliverables: [
        {
          item: 'Multi-camera crew',
        },
        {
          item: 'Per-guest audio',
        },
        {
          item: 'On-site direction',
        },
      ],
      meta: 'Weekly · per episode',
      featured: false,
    },
    {
      title: 'Full-Episode Edit + Reels',
      description:
        'Every episode edited start to finish, plus 3 concept-titled reels built around an actual hook — not auto-clipped highlights.',
      outcome: 'A full ep + 3 reels, weekly',
      deliverables: [
        {
          item: 'Full-episode edit',
        },
        {
          item: '3 concept-titled reels',
        },
        {
          item: 'Thumbnails + captions + carousels',
        },
      ],
      meta: 'Weekly turnaround',
      featured: false,
    },
    {
      title: 'Distribution-Ready Exports',
      description:
        'Dedicated podcast loudness presets, built into our in-house editor — ready for Spotify, YouTube, Instagram, Facebook, Amazon and Apple.',
      outcome: 'Every platform, every week',
      deliverables: [
        {
          item: 'Loudness-matched masters',
        },
        {
          item: 'Platform-native ratios',
        },
        {
          item: 'Distribution-ready files',
        },
      ],
      meta: 'Per episode',
      featured: false,
    },
  ],
  process: [
    {
      week: 'Mon',
      title: 'Full Episode',
      body: 'The complete episode edit, mixed and mastered to podcast loudness spec.',
    },
    {
      week: 'Tue',
      title: 'Reel 1',
      body: 'First concept-titled clip, cut for the feed.',
    },
    {
      week: 'Thu',
      title: 'Reel 2',
      body: 'Second concept-titled clip — a different beat from the same episode.',
    },
    {
      week: 'Sat',
      title: 'Reel 3',
      body: 'Third concept-titled clip, timed to lead into Sunday’s drop.',
    },
    {
      week: 'Sun',
      title: 'The Drop',
      body: 'Full episode goes live everywhere, on schedule, every week.',
    },
  ],
  clients: [
    {
      name: 'Real Talk',
      year: 'S1, 2025–26',
      description:
        'A weekly conversation show produced end-to-end by Slate — full episode plus 3 reels, every single week, 15 episodes without missing one. Guests ranged from rabbis to an OB-GYN to a DJ.',
    },
    {
      name: 'World Within',
      year: '2025',
      description:
        'A client-side show run the same way we run our own: multi-camera filming with dedicated per-guest audio. Your show, our crew.',
    },
  ],
  statementEyebrow: 'A Real Release Calendar',
  statementHeadline: 'A full episode and\nthree reels — every week.',
  statementBody:
    'Most agencies can’t show you a real release-ops calendar. We can — because we run one on ourselves, every week, without missing a Sunday.',
  statementVideo: '/videos/post-production.mp4',
}

const JOURNAL_PAGE_DEFAULTS = {
  hero: {
    eyebrow: 'The Slate Journal',
    titleLine1: 'What it takes',
    titleLine2: 'to get watched',
    subtitle:
      'Field notes from inside our own production process — on story, strategy, and the craft decisions that decide whether someone keeps watching or scrolls past.',
  },
  readLabel: 'Read the piece',
  postCta: {
    headline: 'Have a project in mind?',
    subhead: "Tell us where you're at and we'll point you to the right next step.",
    buttonLabel: 'Get Started',
    buttonHref: '/contact',
  },
  relatedLabel: 'More from the Journal',
}

const NUMBER_WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']

function servicesHeadline(cardCount: number): string {
  if (cardCount === 1) return 'One way it shows up'
  return NUMBER_WORDS[cardCount] ? `${NUMBER_WORDS[cardCount]} ways it shows up` : 'Ways it shows up'
}

// Same 24-hex shape Payload gives array rows (ObjectID-style).
const rowId = () => randomBytes(12).toString('hex')

type Row = Record<string, unknown>

async function createTables(db: MigrationDB) {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`industries_clients\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`year\` text,
  	\`description\` text,
  	\`vimeo_id\` text,
  	\`orientation\` text DEFAULT 'landscape',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`industries_clients_order_idx\` ON \`industries_clients\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`industries_clients_parent_id_idx\` ON \`industries_clients\` (\`_parent_id\`);`,
  )

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_industries_v_version_clients\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`year\` text,
  	\`description\` text,
  	\`vimeo_id\` text,
  	\`orientation\` text DEFAULT 'landscape',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_industries_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`_industries_v_version_clients_order_idx\` ON \`_industries_v_version_clients\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`_industries_v_version_clients_parent_id_idx\` ON \`_industries_v_version_clients\` (\`_parent_id\`);`,
  )

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`journal_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text DEFAULT 'The Slate Journal',
  	\`hero_title_line1\` text DEFAULT 'What it takes',
  	\`hero_title_line2\` text DEFAULT 'to get watched',
  	\`hero_subtitle\` text DEFAULT 'Field notes from inside our own production process — on story, strategy, and the craft decisions that decide whether someone keeps watching or scrolls past.',
  	\`read_label\` text DEFAULT 'Read the piece',
  	\`post_cta_headline\` text DEFAULT 'Have a project in mind?',
  	\`post_cta_subhead\` text DEFAULT 'Tell us where you''re at and we''ll point you to the right next step.',
  	\`post_cta_button_label\` text DEFAULT 'Get Started',
  	\`post_cta_button_href\` text DEFAULT '/contact',
  	\`related_label\` text DEFAULT 'More from the Journal',
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`journal_page__status_idx\` ON \`journal_page\` (\`_status\`);`)

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_journal_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text DEFAULT 'The Slate Journal',
  	\`version_hero_title_line1\` text DEFAULT 'What it takes',
  	\`version_hero_title_line2\` text DEFAULT 'to get watched',
  	\`version_hero_subtitle\` text DEFAULT 'Field notes from inside our own production process — on story, strategy, and the craft decisions that decide whether someone keeps watching or scrolls past.',
  	\`version_read_label\` text DEFAULT 'Read the piece',
  	\`version_post_cta_headline\` text DEFAULT 'Have a project in mind?',
  	\`version_post_cta_subhead\` text DEFAULT 'Tell us where you''re at and we''ll point you to the right next step.',
  	\`version_post_cta_button_label\` text DEFAULT 'Get Started',
  	\`version_post_cta_button_href\` text DEFAULT '/contact',
  	\`version_related_label\` text DEFAULT 'More from the Journal',
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );`)
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`_journal_page_v_created_at_idx\` ON \`_journal_page_v\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_journal_page_v_latest_idx\` ON \`_journal_page_v\` (\`latest\`);`)
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`_journal_page_v_updated_at_idx\` ON \`_journal_page_v\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`_journal_page_v_version_version__status_idx\` ON \`_journal_page_v\` (\`version__status\`);`,
  )
}

/*
  Writes the per-industry backfill onto one live row and its latest
  version row. Columns are a fixed allow-list (never user input), so
  building the SET clause from them is safe; every value is bound.
  `clients` undefined leaves the doc's client rows alone.
*/
async function backfillIndustry(db: MigrationDB, id: number, values: Row, clients: ClientSeed[] | undefined) {
  const columns = Object.keys(values)
  const latest = await db.all<{ id: number }>(
    sql`SELECT \`id\` FROM \`_industries_v\` WHERE \`parent_id\` = ${id} AND \`latest\` = 1`,
  )

  if (columns.length) {
    const live = sql.join(
      columns.map((c) => sql`${sql.raw(`\`${c}\``)} = ${values[c]}`),
      sql`, `,
    )
    await db.run(sql`UPDATE \`industries\` SET ${live} WHERE \`id\` = ${id}`)
    const versioned = sql.join(
      columns.map((c) => sql`${sql.raw(`\`version_${c}\``)} = ${values[c]}`),
      sql`, `,
    )
    for (const v of latest) await db.run(sql`UPDATE \`_industries_v\` SET ${versioned} WHERE \`id\` = ${v.id}`)
  }

  if (!clients) return
  // Replace, not append, so a re-run can't duplicate cards.
  await db.run(sql`DELETE FROM \`industries_clients\` WHERE \`_parent_id\` = ${id}`)
  for (const v of latest)
    await db.run(sql`DELETE FROM \`_industries_v_version_clients\` WHERE \`_parent_id\` = ${v.id}`)
  for (const [i, c] of clients.entries()) {
    const uuid = rowId()
    const orientation = c.orientation ?? 'landscape'
    const vimeoId = c.vimeoId ?? null
    await db.run(sql`INSERT INTO \`industries_clients\` (\`_order\`, \`_parent_id\`, \`id\`, \`name\`, \`year\`, \`description\`, \`vimeo_id\`, \`orientation\`)
      VALUES (${i + 1}, ${id}, ${uuid}, ${c.name}, ${c.year}, ${c.description}, ${vimeoId}, ${orientation})`)
    for (const v of latest) {
      await db.run(sql`INSERT INTO \`_industries_v_version_clients\` (\`_order\`, \`_parent_id\`, \`name\`, \`year\`, \`description\`, \`vimeo_id\`, \`orientation\`, \`_uuid\`)
        VALUES (${i + 1}, ${v.id}, ${c.name}, ${c.year}, ${c.description}, ${vimeoId}, ${orientation}, ${uuid})`)
    }
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  for (const [table, columns] of Object.entries(COLUMNS)) {
    for (const [column, definition] of columns) {
      await addColumn(db, table, column, definition)
      await addColumn(db, `_${table}_v`, `version_${column}`, definition)
    }
  }
  await createTables(db)

  // Existing industries, in the order the site shows them today (newest
  // first -- the old default sort), so the new `order` column keeps the
  // Portfolio menu exactly as it is. Podcasts is excluded: today it's
  // appended last from code, and if a previous partial run already
  // created it below, it must keep the data it was created with.
  const existing = await db.all<{
    id: number
    slug: string
    cards: number
  }>(sql`
    SELECT i.\`id\`, i.\`slug\`,
      (SELECT COUNT(*) FROM \`industries_service_cards\` c WHERE c.\`_parent_id\` = i.\`id\`) AS \`cards\`
    FROM \`industries\` i
    WHERE i.\`slug\` <> 'podcasts'
    ORDER BY i.\`created_at\` DESC, i.\`id\` DESC`)

  for (const [index, doc] of existing.entries()) {
    const seed = INDUSTRY_SEED[doc.slug]
    const values: Row = {
      order: (index + 1) * 10,
      services_headline: servicesHeadline(Number(doc.cards)),
    }
    if (seed?.statement) {
      values.statement_eyebrow = seed.statement.eyebrow
      values.statement_headline = seed.statement.headline
      values.statement_body = seed.statement.body
      values.statement_video = seed.statement.video
    }
    if (seed?.redirect) {
      values.redirect_enabled = 1
      values.redirect_eyebrow = seed.redirect.eyebrow
      values.redirect_headline = seed.redirect.headline
      values.redirect_body = seed.redirect.body
      values.redirect_button_label = seed.redirect.buttonLabel
      values.redirect_url = seed.redirect.url
    }
    await backfillIndustry(db, doc.id, values, seed?.clients)
  }

  // Podcasts: the one industry that only ever existed in code.
  const podcasts = await db.all<{ id: number }>(sql`SELECT \`id\` FROM \`industries\` WHERE \`slug\` = 'podcasts'`)
  if (!podcasts.length) {
    await payload.create({
      collection: 'industries',
      data: {
        ...PODCASTS_DOC,
        order: (existing.length + 1) * 10,
        servicesHeadline: servicesHeadline(PODCASTS_DOC.serviceCards.length),
        _status: 'published',
      },
      draft: false,
      overrideAccess: true,
      req,
    })
  }

  const journal = await db.all<{ id: number }>(sql`SELECT \`id\` FROM \`journal_page\` LIMIT 1`)
  if (!journal.length) {
    await payload.updateGlobal({
      slug: 'journal-page',
      data: { ...JOURNAL_PAGE_DEFAULTS, _status: 'published' },
      draft: false,
      overrideAccess: true,
      req,
    })
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DELETE FROM \`industries\` WHERE \`slug\` = 'podcasts'`)
  for (const table of ['_journal_page_v', 'journal_page', '_industries_v_version_clients', 'industries_clients']) {
    await db.run(sql.raw(`DROP TABLE IF EXISTS \`${table}\`;`))
  }
  for (const [table, columns] of Object.entries(COLUMNS)) {
    for (const [column] of columns) {
      for (const [t, c] of [
        [table, column],
        [`_${table}_v`, `version_${column}`],
      ]) {
        try {
          await db.run(sql.raw(`ALTER TABLE \`${t}\` DROP COLUMN \`${c}\`;`))
        } catch (e) {
          if (!errorText(e).includes('no such column')) throw e
        }
      }
    }
  }
}
