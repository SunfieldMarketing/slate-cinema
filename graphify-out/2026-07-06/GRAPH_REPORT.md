# Graph Report - slate-cinema-master  (2026-07-06)

## Corpus Check
- 54 files · ~782,545 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 278 nodes · 312 edges · 38 communities (19 shown, 19 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Scroll Storytelling Sections|Scroll Storytelling Sections]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Landing Page Sections|Landing Page Sections]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_Project Docs & Agent Rules|Project Docs & Agent Rules]]
- [[_COMMUNITY_Dev Dependencies|Dev Dependencies]]
- [[_COMMUNITY_Package Scripts|Package Scripts]]
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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `cn()` - 14 edges
3. `SectionBackground()` - 9 edges
4. `tailwind` - 6 edges
5. `aliases` - 6 edges
6. `scripts` - 5 edges
7. `npx` - 3 edges
8. `magicui` - 3 edges
9. `usePathCurve()` - 3 edges
10. `StatsBand()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Marquee()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/marquee.tsx → src/lib/utils.ts
- `NumberTicker()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/number-ticker.tsx → src/lib/utils.ts
- `Accordion()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/accordion.tsx → src/lib/utils.ts
- `AccordionItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/accordion.tsx → src/lib/utils.ts
- `AccordionTrigger()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/accordion.tsx → src/lib/utils.ts

## Import Cycles
- 1-file cycle: `src/components/ui/accordion.tsx -> src/components/ui/accordion.tsx`
- 1-file cycle: `src/components/ui/button.tsx -> src/components/ui/button.tsx`

## Hyperedges (group relationships)
- **Next.js Documentation Navigation Pattern** — readme_nextjs_docs_link, readme_learn_nextjs, readme_nextjs_deployment_docs, agents_nextjs_docs [INFERRED 0.75]

## Communities (38 total, 19 thin omitted)

### Community 1 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "Landing Page Sections"
Cohesion: 0.11
Nodes (7): Scene3DWrapper, IndustryStandards(), allSteps, stepConfig, StepId, lines, steps

### Community 3 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (29): dependencies, @base-ui/react, class-variance-authority, clsx, framer-motion, gsap, @gsap/react, lenis (+21 more)

### Community 5 - "Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, ffmpeg-static, shadcn, tailwindcss, @tailwindcss/postcss, @types/node (+3 more)

### Community 6 - "Package Scripts"
Cohesion: 0.07
Nodes (13): callSheetItems, guarantees, methods, processStats, impactStats, industries, stills, navLinks (+5 more)

### Community 7 - "Portfolio Circular Gallery"
Cohesion: 0.09
Nodes (13): contactCards, nextSteps, defaultFaqs, QA, filters, Project, projects, Testimonial (+5 more)

### Community 8 - "Video Frame Extraction Script"
Cohesion: 0.29
Nodes (6): { execSync }, ffmpeg, fs, outputDir, path, videoPath

### Community 9 - "Scroll Morph Hero UI"
Cohesion: 0.29
Nodes (3): AnimationPhase, FlipCardProps, IMAGES

### Community 10 - "Root Layout & Smooth Scroll"
Cohesion: 0.08
Nodes (16): bebas, courier, fraunces, inter, metadata, CameraRig(), PATH, Portals() (+8 more)

### Community 11 - "Scene3D Cinematic Elements"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "page.tsx"
Cohesion: 0.47
Nodes (5): npx, chrome-devtools, magicui, shadcn, @magicuidesign/mcp

### Community 13 - "Scene3D Wrapper"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 37 - "cn"
Cohesion: 0.19
Nodes (12): pages, Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), BorderBeam(), BorderBeamProps, Button() (+4 more)

## Knowledge Gaps
- **143 isolated node(s):** `@magicuidesign/mcp`, `$schema`, `style`, `rsc`, `tsx` (+138 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Package Scripts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `@magicuidesign/mcp`, `$schema`, `style` to the rest of the system?**
  _144 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Landing Page Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Package Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.06951871657754011 - nodes in this community are weakly interconnected._
- **Should `Portfolio Circular Gallery` be split into smaller, more focused modules?**
  _Cohesion score 0.08620689655172414 - nodes in this community are weakly interconnected._