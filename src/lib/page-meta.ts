import type { PageKey } from '@/lib/page-sections'

/*
  The search title and description each original page has always used
  (they were typed into each route's `metadata` until 2026-10-02). They're
  what a page shows when its "Search engines & sharing" fields are left
  blank, and they appear as the greyed-out placeholder in those fields so
  editors can see what they'd be replacing.

  Plain data: imported by the page globals (placeholders) and the routes.
*/

type OriginalPage = Exclude<PageKey, 'industry'>

export const PAGE_META = {
  // The homepage takes Site Settings > SEO's default title and description.
  home: {},
  howItWorks: {
    title: 'How It Works',
    description:
      'A clear, structured process designed to take your project from idea to final delivery — seamlessly, efficiently, and cinematically.',
  },
  portfolio: {
    title: 'Our Work',
    description: 'Browse Slate Cinema video production work by industry, and explore the full reel of selected campaigns.',
  },
  contact: {
    title: 'Get Started',
    description:
      'Tell us where you’re at — leave a quick lead, fill out a full project intake, or schedule a call. We reply within minutes.',
  },
  scheduleCall: {
    title: 'Schedule a Call',
    description:
      'Book a 20-minute call with our team to talk through your project, timeline, and budget — no pitch deck, just an honest read on scope.',
  },
  socialMedia: {
    title: 'Social Media Management',
    description:
      "We run social media for businesses that need to focus on operations. Slate Cinema plans, produces, schedules and publishes social content for client businesses across Instagram, Facebook, TikTok, YouTube and X — from one calendar, with one approval step, on the client's own accounts.",
  },
  journal: {
    title: 'The Slate Journal',
    description:
      'Notes on video production, storytelling, and brand — practical writing from Slate Cinema on what actually earns attention and what makes people watch to the end.',
  },
  // Title: the document's own title field.
  privacy: {
    description:
      'How Slate Cinema collects, uses, stores and protects data as part of its social media management service and publishing platform.',
  },
  terms: {
    description:
      'Terms governing use of the Slate Cinema social media management service and the publishing platform that supports it.',
  },
  thankYou: {
    title: 'Thank You',
    description: "We've got your submission — here's what happens next.",
  },
} satisfies Record<OriginalPage, { title?: string; description?: string }>
