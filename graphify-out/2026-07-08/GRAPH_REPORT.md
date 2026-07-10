# Graph Report - slate-cinema-master  (2026-07-08)

## Corpus Check
- 71 files · ~800,428 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 351 nodes · 438 edges · 43 communities (22 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Scroll Storytelling Sections|Scroll Storytelling Sections]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Landing Page Sections|Landing Page Sections]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_Project Docs & Agent Rules|Project Docs & Agent Rules]]
- [[_COMMUNITY_Dev Dependencies|Dev Dependencies]]
- [[_COMMUNITY_magic-card.tsx|magic-card.tsx]]
- [[_COMMUNITY_Portfolio Circular Gallery|Portfolio Circular Gallery]]
- [[_COMMUNITY_Video Frame Extraction Script|Video Frame Extraction Script]]
- [[_COMMUNITY_Scroll Morph Hero UI|Scroll Morph Hero UI]]
- [[_COMMUNITY_Root Layout & Smooth Scroll|Root Layout & Smooth Scroll]]
- [[_COMMUNITY_Scene3D Cinematic Elements|Scene3D Cinematic Elements]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_Scene3D Wrapper|Scene3D Wrapper]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Preloader|Preloader]]
- [[_COMMUNITY_Original Hero Backup|Original Hero Backup]]
- [[_COMMUNITY_node_modulesnextdistdocs|node_modules/next/dist/docs/]]
- [[_COMMUNITY_CLAUDE.md (includes AGENTS.md)|CLAUDE.md (includes AGENTS.md)]]
- [[_COMMUNITY_apppage.tsx|app/page.tsx]]
- [[_COMMUNITY_create-next-app CLI|create-next-app CLI]]
- [[_COMMUNITY_Development Server (npmyarnpnpmbun dev)|Development Server (npm/yarn/pnpm/bun dev)]]
- [[_COMMUNITY_Geist Font (Vercel)|Geist Font (Vercel)]]
- [[_COMMUNITY_Learn Next.js Tutorial|Learn Next.js Tutorial]]
- [[_COMMUNITY_nextfont|next/font]]
- [[_COMMUNITY_Next.js Deployment Documentation|Next.js Deployment Documentation]]
- [[_COMMUNITY_Next.js Documentation (nextjs.orgdocs)|Next.js Documentation (nextjs.org/docs)]]
- [[_COMMUNITY_Next.js GitHub Repository (vercelnext.js)|Next.js GitHub Repository (vercel/next.js)]]
- [[_COMMUNITY_Slate Cinema (Next.js project bootstrapped with create-next-app)|Slate Cinema (Next.js project bootstrapped with create-next-app)]]
- [[_COMMUNITY_Vercel Platform (deployment)|Vercel Platform (deployment)]]
- [[_COMMUNITY_cn|cn]]
- [[_COMMUNITY_three-d-carousel.tsx|three-d-carousel.tsx]]
- [[_COMMUNITY_layout.tsx|layout.tsx]]
- [[_COMMUNITY_shader-lens-blur.tsx|shader-lens-blur.tsx]]
- [[_COMMUNITY_CinemaCamera.tsx|CinemaCamera.tsx]]
- [[_COMMUNITY_CinematicStatement.tsx|CinematicStatement.tsx]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 21 edges
2. `compilerOptions` - 16 edges
3. `categories` - 7 edges
4. `tailwind` - 6 edges
5. `aliases` - 6 edges
6. `AmbientBackdrop()` - 6 edges
7. `MagicCard()` - 6 edges
8. `getIndustryBySlug()` - 6 edges
9. `scripts` - 5 edges
10. `industries` - 5 edges

## Surprising Connections (you probably didn't know these)
- `generateMetadata()` --calls--> `getIndustryBySlug()`  [EXTRACTED]
  src/app/portfolio/[industry]/page.tsx → src/lib/industries.ts
- `IndustryPage()` --calls--> `getIndustryBySlug()`  [EXTRACTED]
  src/app/portfolio/[industry]/page.tsx → src/lib/industries.ts
- `IndustryPageContent()` --calls--> `getIndustryBySlug()`  [EXTRACTED]
  src/components/IndustryPageContent.tsx → src/lib/industries.ts
- `Accordion()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/accordion.tsx → src/lib/utils.ts
- `AccordionItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/accordion.tsx → src/lib/utils.ts

## Import Cycles
- 1-file cycle: `src/components/ui/accordion.tsx -> src/components/ui/accordion.tsx`
- 1-file cycle: `src/components/ui/button.tsx -> src/components/ui/button.tsx`

## Hyperedges (group relationships)
- **Next.js Documentation Navigation Pattern** — readme_nextjs_docs_link, readme_learn_nextjs, readme_nextjs_deployment_docs, agents_nextjs_docs [INFERRED 0.75]

## Communities (43 total, 21 thin omitted)

### Community 1 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "Landing Page Sections"
Cohesion: 0.07
Nodes (21): generateMetadata(), IndustryPage(), impactStats, IndustryPageContent(), polarToCartesian(), segmentPath(), navLinks, filters (+13 more)

### Community 3 - "Runtime Dependencies"
Cohesion: 0.06
Nodes (32): dependencies, animejs, @base-ui/react, class-variance-authority, clsx, framer-motion, gsap, @gsap/react (+24 more)

### Community 5 - "Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, ffmpeg-static, shadcn, tailwindcss, @tailwindcss/postcss, @types/node (+3 more)

### Community 6 - "magic-card.tsx"
Cohesion: 0.19
Nodes (9): Testimonial, testimonials, isOrbMode(), MagicCard(), MagicCardBaseProps, MagicCardGradientProps, MagicCardOrbProps, MagicCardProps (+1 more)

### Community 7 - "Portfolio Circular Gallery"
Cohesion: 0.08
Nodes (9): contactCards, nextSteps, IndustryStandards(), allSteps, stepConfig, StepId, lines, AmbientBackdrop() (+1 more)

### Community 8 - "Video Frame Extraction Script"
Cohesion: 0.29
Nodes (6): { execSync }, ffmpeg, fs, outputDir, path, videoPath

### Community 9 - "Scroll Morph Hero UI"
Cohesion: 0.29
Nodes (3): AnimationPhase, FlipCardProps, IMAGES

### Community 10 - "Root Layout & Smooth Scroll"
Cohesion: 0.09
Nodes (18): bebas, caveat, courier, fraunces, inter, metadata, SmoothScrolling(), ScrollExpandMediaProps (+10 more)

### Community 11 - "Scene3D Cinematic Elements"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "page.tsx"
Cohesion: 0.47
Nodes (5): npx, chrome-devtools, magicui, shadcn, @magicuidesign/mcp

### Community 13 - "Scene3D Wrapper"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 37 - "cn"
Cohesion: 0.14
Nodes (15): clients, Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), BorderBeam(), BorderBeamProps, Button() (+7 more)

### Community 38 - "three-d-carousel.tsx"
Cohesion: 0.25
Nodes (5): Carousel, keywords, transition, transitionOverlay, UseMediaQueryOptions

### Community 39 - "layout.tsx"
Cohesion: 0.15
Nodes (7): guarantees, methods, processPhases, processStats, stills, Stat, StatsBand()

### Community 40 - "shader-lens-blur.tsx"
Cohesion: 0.40
Nodes (3): configAtom, initialState, ShaderConfig

### Community 41 - "CinemaCamera.tsx"
Cohesion: 0.10
Nodes (17): PHONES, PLATFORMS, PostProductionScene(), RULER_MARKS, WAVE_POINTS, wavePath(), CARD_TILTS, FRAMES (+9 more)

## Knowledge Gaps
- **171 isolated node(s):** `@magicuidesign/mcp`, `$schema`, `style`, `rsc`, `tsx` (+166 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Landing Page Sections`, `magic-card.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `AmbientBackdrop()` connect `Portfolio Circular Gallery` to `Landing Page Sections`, `layout.tsx`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `@magicuidesign/mcp`, `$schema`, `style` to the rest of the system?**
  _172 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Landing Page Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.06767676767676768 - nodes in this community are weakly interconnected._
- **Should `Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Portfolio Circular Gallery` be split into smaller, more focused modules?**
  _Cohesion score 0.0812807881773399 - nodes in this community are weakly interconnected._