# Graph Report - slate-cinema-master  (2026-07-04)

## Corpus Check
- 37 files · ~776,731 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 181 nodes · 168 edges · 37 communities (18 shown, 19 thin omitted)
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
- [[_COMMUNITY_Lead Magnet Funnel|Lead Magnet Funnel]]
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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `scripts` - 5 edges
3. `ScrollState` - 4 edges
4. `usePathCurve()` - 3 edges
5. `measureSections()` - 3 edges
6. `publishScroll()` - 3 edges
7. `toTimecode()` - 3 edges
8. `shouldReduceMotion()` - 3 edges
9. `IndustryStandards()` - 2 edges
10. `Portfolio()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Next.js Documentation Navigation Pattern** — readme_nextjs_docs_link, readme_learn_nextjs, readme_nextjs_deployment_docs, agents_nextjs_docs [INFERRED 0.75]

## Communities (37 total, 19 thin omitted)

### Community 1 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "Landing Page Sections"
Cohesion: 0.08
Nodes (8): Scene3DWrapper, IndustryStandards(), lines, navLinks, steps, carouselTestimonials, gridTestimonials, imagePositions

### Community 3 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, clsx, framer-motion, gsap, @gsap/react, lenis, lucide-react, next (+9 more)

### Community 5 - "Dev Dependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, ffmpeg-static, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+2 more)

### Community 6 - "Package Scripts"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 7 - "Portfolio Circular Gallery"
Cohesion: 0.32
Nodes (5): galleryData, Portfolio(), CircularGallery, CircularGalleryProps, GalleryItem

### Community 8 - "Video Frame Extraction Script"
Cohesion: 0.29
Nodes (6): { execSync }, ffmpeg, fs, outputDir, path, videoPath

### Community 9 - "Scroll Morph Hero UI"
Cohesion: 0.29
Nodes (3): AnimationPhase, FlipCardProps, IMAGES

### Community 10 - "Root Layout & Smooth Scroll"
Cohesion: 0.17
Nodes (10): inter, metadata, CHAPTER_LABELS, SmoothScrolling(), measureSections(), publishScroll(), ScrollState, SectionRange (+2 more)

### Community 11 - "Scene3D Cinematic Elements"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "Lead Magnet Funnel"
Cohesion: 0.40
Nodes (3): allSteps, stepConfig, StepId

### Community 13 - "Scene3D Wrapper"
Cohesion: 0.16
Nodes (4): CameraRig(), PATH, Portals(), usePathCurve()

## Knowledge Gaps
- **97 isolated node(s):** `eslintConfig`, `ffmpeg`, `{ execSync }`, `fs`, `path` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Runtime Dependencies` to `Package Scripts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies` to `Package Scripts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `ScrollState` connect `Root Layout & Smooth Scroll` to `Scene3D Wrapper`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `ffmpeg`, `{ execSync }` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Landing Page Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._