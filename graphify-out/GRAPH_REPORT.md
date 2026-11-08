# Graph Report - slate-cinema-github  (2026-11-03)

## Corpus Check
- 215 files · ~1,077,592 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1897 nodes · 4775 edges · 137 communities (83 shown, 54 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 335 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1640a56a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- mediaUrl
- compilerOptions
- industries.ts
- dependencies
- Next.js Agent Rules (Not the Next.js You Know)
- k
- fk
- HowItWorksPageContent.tsx
- extract_frames.js
- scroll-morph-hero.tsx
- payload-data.ts
- README.md
- .mcp.json
- components.json
- ha
- next.config.ts
- postcss.config.mjs
- thank-you/page.tsx
- ci
- migrations/index.ts
- AGENTS.md
- node_modules/next/dist/docs/
- CLAUDE.md (includes AGENTS.md)
- app/page.tsx
- create-next-app CLI
- Development Server (npm/yarn/pnpm/bun dev)
- Geist Font (Vercel)
- Learn Next.js Tutorial
- next/font
- Next.js Deployment Documentation
- Next.js Documentation (nextjs.org/docs)
- Next.js GitHub Repository (vercel/next.js)
- Slate Cinema (Next.js project bootstrapped with create-next-app)
- Vercel Platform (deployment)
- cn
- PortfolioPageContent.tsx
- blocks/index.ts
- shader-lens-blur.tsx
- StoryboardHero.tsx
- aq
- draco_encoder.js
- normalize.ts
- draco_wasm_wrapper.js
- draco_decoder.js
- assert
- getCache
- RenderBlocks.tsx
- site-data-context.tsx
- ExceptionInfo
- A
- ContactPageContent.tsx
- f
- getCache
- l
- seed/index.ts
- callRuntimeCallbacks
- circular-gallery.tsx
- callRuntimeCallbacks
- getBinary
- 20261002_180000_page_sections.ts
- 20261002_000000_page_builder.ts
- pj
- n
- tryParseAsDataURI
- intArrayFromString
- Migrations
- payload-types.ts
- 20261002_220000_remaining_copy.ts
- react
- Pages.ts
- 20261001_000000_cms_full_coverage.ts
- payload.config.ts
- changelog.ts
- ln
- importMap.js
- lens.tsx
- devDependencies
- 20261002_200000_page_seo.ts
- Slate Cinema — Project Context
- IndustryHeroSequence.tsx
- vimeo-api.ts
- 20261103_000000_gallery_and_map.ts
- 20261103_010000_light_statement_video.ts
- PageHero.tsx
- SiteSettings.ts
- [...slug]/route.ts
- revalidate.ts
- @base-ui/react
- Hero.tsx
- class-variance-authority
- 20261002_230000_brand_color.ts
- emscripten_realloc_buffer
- magic-card.tsx
- eslint.config.mjs
- simpleRichText
- framer-motion
- graphql
- gsap
- @gsap/react
- jotai
- lenis
- lucide-react
- next-themes
- @payloadcms/db-postgres
- @payloadcms/db-sqlite
- @payloadcms/next
- graphql/route.ts
- @payloadcms/richtext-lexical
- @payloadcms/storage-s3
- @payloadcms/storage-vercel-blob
- posthog-js
- react-dom
- motion
- @react-three/fiber
- @react-three/postprocessing
- sharp
- @studio-freight/react-lenis
- next
- payload
- tw-animate-css
- @types/three
- wrapPointer
- Config
- TopWorkShowcase.tsx
- pushConversion
- number-ticker.tsx
- 20260826_130000_add_privacy_terms_thankyou_smm_pages.ts
- 20260822_062619_add_vimeo_hookups.ts
- 20260824_000000_add_trust_banner.ts
- 20260924_000000_add_changelog.ts
- page-meta.ts

## God Nodes (most connected - your core abstractions)
1. `ln()` - 159 edges
2. `ha()` - 156 edges
3. `aq()` - 135 edges
4. `sj()` - 87 edges
5. `kh()` - 60 edges
6. `useBrandColor()` - 40 edges
7. `un()` - 36 edges
8. `I()` - 34 edges
9. `loadBlocksData()` - 31 edges
10. `pageMetadata()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `flatten()` --indirect_call--> `k()`  [INFERRED]
  src/lib/changelog.ts → public/draco/draco_wasm_wrapper.js
- `LeadForm()` --references--> `react`  [EXTRACTED]
  src/components/ContactPageContent.tsx → package.json
- `StickyScroll()` --references--> `react`  [EXTRACTED]
  src/components/ui/sticky-scroll-reveal.tsx → package.json
- `ha()` --indirect_call--> `mh()`  [INFERRED]
  public/draco/draco_decoder.js → public/draco/draco_encoder.js
- `ha()` --indirect_call--> `nh()`  [INFERRED]
  public/draco/draco_decoder.js → public/draco/draco_encoder.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Next.js Documentation Navigation Pattern** — readme_nextjs_docs_link, readme_learn_nextjs, readme_nextjs_deployment_docs, agents_nextjs_docs [INFERRED 0.75]

## Communities (137 total, 54 thin omitted)

### Community 0 - "mediaUrl"
Cohesion: 0.16
Nodes (14): BehindTheScenes(), fallbackStills, MediaFrame(), ProcessWalkthrough(), fallbackClients, TrustBanner(), fallbackClients, fallbackFlagship (+6 more)

### Community 1 - "compilerOptions"
Cohesion: 0.06
Nodes (32): _abort(), warnOnce(), dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts (+24 more)

### Community 2 - "industries.ts"
Cohesion: 0.17
Nodes (9): TestimonialCard(), IndustryCinematicStatement, IndustryClient, IndustryData, IndustryFaq, IndustryProcessStep, IndustryServiceCard, IndustryStat (+1 more)

### Community 3 - "dependencies"
Cohesion: 0.15
Nodes (13): animejs, clsx, dependencies, animejs, clsx, @payloadcms/plugin-form-builder, @react-three/drei, tailwind-merge (+5 more)

### Community 5 - "k"
Cohesion: 0.33
Nodes (7): lh(), mg(), vn(), ye(), C(), k(), q()

### Community 6 - "fk"
Cohesion: 0.15
Nodes (14): fk(), hi(), ij(), je(), Kc(), np(), og(), pd() (+6 more)

### Community 7 - "HowItWorksPageContent.tsx"
Cohesion: 0.11
Nodes (25): cmsAttributes(), CmsTarget, PageSections(), resolveSections(), SectionRow, BlockShell(), BlockOfType, BlocksData (+17 more)

### Community 8 - "extract_frames.js"
Cohesion: 0.22
Nodes (8): { execSync }, ffmpeg, fs, outputDir, path, videoPath, ___syscall140(), ___syscall6()

### Community 9 - "scroll-morph-hero.tsx"
Cohesion: 0.38
Nodes (5): AnimationPhase, FlipCardProps, IMAGES, IntroAnimation(), lerp()

### Community 10 - "payload-data.ts"
Cohesion: 0.05
Nodes (82): ContactPage(), generateMetadata(), generateMetadata(), generateMetadata(), HowItWorksPage(), generateMetadata(), JournalPage(), generateMetadata() (+74 more)

### Community 11 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - ".mcp.json"
Cohesion: 0.47
Nodes (5): npx, chrome-devtools, magicui, shadcn, @magicuidesign/mcp

### Community 13 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 14 - "ha"
Cohesion: 0.10
Nodes (68): ha(), ad(), ag(), bd(), bg(), _c(), cd(), ce() (+60 more)

### Community 17 - "thank-you/page.tsx"
Cohesion: 0.14
Nodes (18): links, metadata, NOTE: bare title, no manual "| Slate Cinema" suffix -- the root layout's, fallbackNextSteps, ICONS, RenderBlocks(), CustomPageContent(), Footer() (+10 more)

### Community 18 - "ci"
Cohesion: 0.11
Nodes (37): af(), bh(), bn(), bq(), ci(), dd(), dj(), _e() (+29 more)

### Community 37 - "cn"
Cohesion: 0.20
Nodes (13): DEFAULT_ASIDE, DEFAULT_HEADING, FaqAside, IndustryFaq(), Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger() (+5 more)

### Community 38 - "PortfolioPageContent.tsx"
Cohesion: 0.18
Nodes (14): bentoCoveredCount(), bentoGroups, LG_SPAN, Portfolio(), TRAILING_SPANS, trailingTileClass(), ProjectCardModal(), Carousel (+6 more)

### Community 39 - "blocks/index.ts"
Cohesion: 0.08
Nodes (28): BookingBlock, CardsBlock, ClientCardsBlock, CtaBandBlock, EmbedBlock, FaqBlock, FinalCtaBlock, HeroBlock (+20 more)

### Community 40 - "shader-lens-blur.tsx"
Cohesion: 0.40
Nodes (3): configAtom, initialState, ShaderConfig

### Community 41 - "StoryboardHero.tsx"
Cohesion: 0.07
Nodes (34): CTA_ENTER, INTRO_EXIT, MODEL_CREDITS, MODELS, RANGE_MULTIPLIER, SCENE_CLASSES, SCENE_ENTERS, SCENE_EXITS (+26 more)

### Community 42 - "aq"
Cohesion: 0.12
Nodes (59): ab(), Ac(), Ae(), aq(), _b(), bb(), be(), cb() (+51 more)

### Community 43 - "draco_encoder.js"
Cohesion: 0.01
Nodes (93): c(), aj(), ak(), am(), bi(), bo(), cm(), demangle() (+85 more)

### Community 44 - "normalize.ts"
Cohesion: 0.10
Nodes (26): INDUSTRY_PATHS, MidCtaBand(), mediaUrlOrPlaceholder(), IndustryClientCard, IndustryCta, IndustryData, IndustryRedirect, IndustryStat (+18 more)

### Community 45 - "draco_wasm_wrapper.js"
Cohesion: 0.20
Nodes (18): kd(), od(), qb(), ul(), B(), E(), G(), H() (+10 more)

### Community 46 - "draco_decoder.js"
Cohesion: 0.08
Nodes (10): addRunDependency(), createWasm(), ensureString(), intArrayFromString(), l(), lengthBytesUTF8(), p(), stringToUTF8Array() (+2 more)

### Community 47 - "assert"
Cohesion: 0.15
Nodes (17): alignUp(), allocate(), assert(), ccall(), dynamicAlloc(), enlargeMemory(), getCFunc(), getNativeTypeSize() (+9 more)

### Community 48 - "getCache"
Cohesion: 0.10
Nodes (20): AttributeOctahedronTransform(), AttributeQuantizationTransform(), AttributeTransformData(), Decoder(), DecoderBuffer(), destroy(), DracoFloat32Array(), DracoInt16Array() (+12 more)

### Community 49 - "RenderBlocks.tsx"
Cohesion: 0.12
Nodes (25): lines(), RenderBlock(), accentVar(), ASPECT, CardsSection(), COLUMNS, EmbedSection(), JournalCards() (+17 more)

### Community 50 - "site-data-context.tsx"
Cohesion: 0.13
Nodes (22): IndustryPageContent(), INDUSTRY_PATHS, IndustryProcess(), STEP_ICONS, cardSpan(), INDUSTRY_PATHS, IndustryServices(), LG_COLS (+14 more)

### Community 53 - "ContactPageContent.tsx"
Cohesion: 0.09
Nodes (29): CallFraming(), fallbackPrepItems, Badge, BadgeRow(), bokehDots, ContactMethods(), ContactPageContent(), fallbackNextSteps (+21 more)

### Community 54 - "f"
Cohesion: 0.17
Nodes (15): an(), bm(), en(), fn(), kn(), lq(), _m(), on() (+7 more)

### Community 55 - "getCache"
Cohesion: 0.14
Nodes (14): castObject(), destroy(), DracoInt8Array(), Encoder(), GeometryAttribute(), getCache(), Mesh(), MeshBuilder() (+6 more)

### Community 57 - "seed/index.ts"
Cohesion: 0.15
Nodes (13): JournalBlock, JournalPost, journalPosts, PortfolioProject, portfolioProjects, blocksToLexical(), ICON_NAME_BY_INDUSTRY_ID, IconName (+5 more)

### Community 58 - "callRuntimeCallbacks"
Cohesion: 0.20
Nodes (10): addOnPostRun(), addOnPreRun(), callRuntimeCallbacks(), ensureInitRuntime(), exit(), exitRuntime(), postRun(), preMain() (+2 more)

### Community 59 - "circular-gallery.tsx"
Cohesion: 0.40
Nodes (3): CircularGallery, CircularGalleryProps, GalleryItem

### Community 60 - "callRuntimeCallbacks"
Cohesion: 0.29
Nodes (7): addOnPostRun(), addOnPreRun(), callRuntimeCallbacks(), initRuntime(), postRun(), preRun(), run()

### Community 61 - "getBinary"
Cohesion: 0.25
Nodes (8): abort(), assert(), getBinary(), getBinaryPromise(), intArrayFromBase64(), isDataURI(), isFileURI(), tryParseAsDataURI()

### Community 62 - "20261002_180000_page_sections.ts"
Cohesion: 0.26
Nodes (11): addColumn(), down(), dropColumn(), errorText(), GLOBAL_SECTIONS, INDUSTRY_SECTIONS, INTAKE_BAND_COLUMNS, MigrationDB (+3 more)

### Community 63 - "20261002_000000_page_builder.ts"
Cohesion: 0.33
Nodes (9): addColumn(), BOOLEAN_COLUMNS, camel(), copyFormFields(), down(), errorText(), FORM_BLOCK_TYPES, MigrationDB (+1 more)

### Community 64 - "pj"
Cohesion: 0.09
Nodes (30): ai(), ao(), bf(), bk(), ch(), cj(), dg(), dp() (+22 more)

### Community 65 - "n"
Cohesion: 0.39
Nodes (3): ii(), n(), p()

### Community 66 - "tryParseAsDataURI"
Cohesion: 0.40
Nodes (5): doBrowserLoad(), intArrayFromBase64(), isDataURI(), tryParseAsDataURI(), useRequest()

### Community 67 - "intArrayFromString"
Cohesion: 0.40
Nodes (5): ensureString(), intArrayFromString(), lengthBytesUTF8(), stringToUTF8(), stringToUTF8Array()

### Community 69 - "Migrations"
Cohesion: 0.20
Nodes (9): `20260819_203145_initial_schema_baseline`, `20260819_203226_add_api_key_auth`, `20260820_233310_add_drafts_versions_live_preview`, Going forward, Migrations, The other prompt: "you've run Payload in dev mode", The `tsx`/Node 24 trap, The two bugs this migration actually shipped with, found after promoting (+1 more)

### Community 70 - "payload-types.ts"
Cohesion: 0.02
Nodes (92): Auth, BookingBlock, BookingBlockSelect, CardsBlock, CardsBlockSelect, Changelog, ChangelogSelect, ClientCardsBlock (+84 more)

### Community 71 - "20261002_220000_remaining_copy.ts"
Cohesion: 0.39
Nodes (7): addColumn(), COLUMNS, down(), errorText(), MigrationDB, quote(), up()

### Community 72 - "react"
Cohesion: 0.33
Nodes (3): react, react, ContainerScroll()

### Community 73 - "Pages.ts"
Cohesion: 0.43
Nodes (6): contentBlocks, formatPath(), normalizePath(), Pages, RESERVED_PATHS, validatePath()

### Community 74 - "20261001_000000_cms_full_coverage.ts"
Cohesion: 0.14
Nodes (19): addColumn(), backfillIndustry(), ClientSeed, COLUMNS, createTables(), down(), errorText(), INDUSTRY_SEED (+11 more)

### Community 75 - "payload.config.ts"
Cohesion: 0.08
Nodes (24): GET, Changelog, Users, ContactPage, FinalCTA, Footer, HomePage, HowItWorksPage (+16 more)

### Community 76 - "changelog.ts"
Cohesion: 0.29
Nodes (14): actionFor(), describe(), diff(), Flat, flatten(), IGNORED_KEYS, isRichText(), labelOf() (+6 more)

### Community 77 - "ln"
Cohesion: 0.07
Nodes (51): $a(), ah(), Bc(), bj(), bp(), Cc(), cf(), cg() (+43 more)

### Community 78 - "importMap.js"
Cohesion: 0.11
Nodes (13): importMap, Args, Args, Args, AdminIcon(), AdminLogo(), CmsFieldClickMessage, isCmsFieldClickMessage() (+5 more)

### Community 80 - "devDependencies"
Cohesion: 0.05
Nodes (38): cross-env, eslint, eslint-config-next, ffmpeg-static, devDependencies, cross-env, eslint, eslint-config-next (+30 more)

### Community 81 - "20261002_200000_page_seo.ts"
Cohesion: 0.43
Nodes (6): addColumn(), down(), errorText(), MigrationDB, TABLES, up()

### Community 82 - "Slate Cinema — Project Context"
Cohesion: 0.06
Nodes (29): Dynamic / repeatable content, Forms, ⚠️ Most important finding — read this first, Notes on current codebase state, Pages, Per-page block inventory, Reusable globals, Slate Cinema → Payload CMS 3 Migration — Phase 0 Inventory (+21 more)

### Community 84 - "vimeo-api.ts"
Cohesion: 0.27
Nodes (10): getPublicVideo(), getToken(), listPublicVideos(), pickThumbnail(), RawVimeoVideo, toSummary(), VimeoConfigError, vimeoFetch() (+2 more)

### Community 85 - "20261103_000000_gallery_and_map.ts"
Cohesion: 0.43
Nodes (6): addColumn(), down(), errorText(), GALLERY_PICKS, MigrationDB, up()

### Community 86 - "20261103_010000_light_statement_video.ts"
Cohesion: 0.47
Nodes (5): COLUMNS, down(), RENAMES, rewrite(), up()

### Community 87 - "PageHero.tsx"
Cohesion: 0.14
Nodes (19): FRAME, INDUSTRY_PATHS, IndustryClientShowcase(), PortfolioPageContent(), fallbackTestimonials, initials(), PhoneVideoCard(), Reviews() (+11 more)

### Community 88 - "SiteSettings.ts"
Cohesion: 0.50
Nodes (3): SiteSettings, DEFAULT_BRAND, validateHex()

### Community 89 - "[...slug]/route.ts"
Cohesion: 0.29
Nodes (6): DELETE, GET, OPTIONS, PATCH, POST, PUT

### Community 90 - "revalidate.ts"
Cohesion: 0.23
Nodes (9): ICON_OPTIONS, Industries, ORIENTATION_OPTIONS, JournalPosts, Media, PortfolioProjects, revalidateCollectionAfterChange(), revalidateCollectionAfterDelete() (+1 more)

### Community 92 - "Hero.tsx"
Cohesion: 0.11
Nodes (26): attachAutoplayVideo(), FOCUS_KEYFRAMES, getFocus(), Hero(), lerp(), mobileFrameSlot(), smoothstep(), Results() (+18 more)

### Community 94 - "20261002_230000_brand_color.ts"
Cohesion: 0.60
Nodes (4): COLUMNS, down(), errorText(), up()

### Community 95 - "emscripten_realloc_buffer"
Cohesion: 0.50
Nodes (4): emscripten_realloc_buffer(), _emscripten_resize_heap(), getHeapMax(), updateMemoryViews()

### Community 96 - "magic-card.tsx"
Cohesion: 0.38
Nodes (6): isOrbMode(), MagicCardBaseProps, MagicCardGradientProps, MagicCardOrbProps, MagicCardProps, ResetReason

### Community 98 - "simpleRichText"
Cohesion: 0.37
Nodes (7): POST(), POST(), POST(), POST(), forwardToGHL(), splitName(), simpleRichText()

### Community 129 - "TopWorkShowcase.tsx"
Cohesion: 0.38
Nodes (4): shots, DraggableCardBody(), DraggableCardContainer(), industries

### Community 130 - "pushConversion"
Cohesion: 0.39
Nodes (5): IntakeFrame(), ThankYouTracking(), ConversionEvent, pushConversion(), Window

### Community 132 - "number-ticker.tsx"
Cohesion: 0.40
Nodes (4): NumberTicker(), NumberTickerProps, Stat, StatsBand()

### Community 133 - "20260826_130000_add_privacy_terms_thankyou_smm_pages.ts"
Cohesion: 0.47
Nodes (4): createTableIfNotExists(), isTableExistsError(), MigrationDB, up()

### Community 135 - "20260822_062619_add_vimeo_hookups.ts"
Cohesion: 0.50
Nodes (3): ADDS, isDuplicateColumnError(), up()

### Community 136 - "20260824_000000_add_trust_banner.ts"
Cohesion: 0.60
Nodes (3): isDuplicateColumnError(), isTableExistsError(), up()

### Community 137 - "20260924_000000_add_changelog.ts"
Cohesion: 0.83
Nodes (3): down(), errorText(), up()

### Community 138 - "page-meta.ts"
Cohesion: 0.23
Nodes (15): builtInBlock(), defaultSections(), sectionsField(), seoFields(), CONTACT_ICONS, GUARANTEE_ICONS, ICON_OPTIONS, OriginalPage (+7 more)

## Knowledge Gaps
- **441 isolated node(s):** `@magicuidesign/mcp`, `$schema`, `style`, `rsc`, `tsx` (+436 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `k()` connect `k` to `pj`, `n`, `fk`, `draco_encoder.js`, `changelog.ts`, `draco_wasm_wrapper.js`, `ha`, `f`?**
  _High betweenness centrality (0.383) - this node is a cross-community bridge._
- **Why does `flatten()` connect `changelog.ts` to `k`?**
  _High betweenness centrality (0.383) - this node is a cross-community bridge._
- **Why does `ha()` connect `ha` to `pj`, `n`, `k`, `fk`, `aq`, `draco_encoder.js`, `ln`, `draco_decoder.js`, `ci`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Are the 153 inferred relationships involving `ha()` (e.g. with `Ac()` and `ad()`) actually correct?**
  _`ha()` has 153 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@magicuidesign/mcp`, `$schema`, `style` to the rest of the system?**
  _441 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `HowItWorksPageContent.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10793650793650794 - nodes in this community are weakly interconnected._