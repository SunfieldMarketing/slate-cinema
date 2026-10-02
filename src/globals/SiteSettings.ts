import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'

/*
  Site-wide SEO defaults + the contact details reused across the JSON-LD
  schema (src/app/layout.tsx), the Contact page's StudioLocation
  section, and the Footer.
*/
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Site Settings' },
  versions: { drafts: true },
  access: {
    // Public reads only ever see published content -- unpublished
    // drafts must stay invisible to real visitors until explicitly
    // published. Found 2026-08-24: this used to be a bare `() => true`
    // (no status check at all), which combined with the Local API's
    // default overrideAccess:true meant a saved-but-unpublished draft
    // was visible on the live public site immediately -- see this
    // session's e2eTest finding (journalPostLifecycle.hiddenWhileDraft
    // came back false). payload-data.ts now threads overrideAccess:
    // draft through every call so this constraint actually applies to
    // ordinary (draft:false) visitors, while Live Preview (draft:true)
    // passes overrideAccess:true and bypasses it entirely, same as an
    // authenticated admin editing in /admin.
    read: ({ req }) => Boolean(req?.user) || { _status: { equals: 'published' } },
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'titleTemplate', type: 'text', defaultValue: '%s | Slate Cinema' },
        {
          name: 'defaultTitle',
          type: 'text',
          defaultValue: 'Slate Cinema',
          admin: {
            description:
              'TikTok Content Posting API requirement: the homepage tab title must be literally "Slate Cinema" -- no tagline, no template suffix.',
          },
        },
        {
          name: 'defaultDescription',
          type: 'textarea',
          defaultValue:
            'From concept to campaign, we create cinematic content built to capture attention, tell stories, and drive engagement. Brooklyn, NY.',
        },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'email', required: true, defaultValue: 'info@slatecinema.com' },
        { name: 'phone', type: 'text', required: true, defaultValue: '+1 732 930 1934' },
        { name: 'studioName', type: 'text', defaultValue: 'Slate Cinema Studio' },
        { name: 'addressLine', type: 'text', defaultValue: '132 32nd St' },
        { name: 'city', type: 'text', defaultValue: 'Brooklyn' },
        { name: 'state', type: 'text', defaultValue: 'NY' },
        { name: 'postalCode', type: 'text', defaultValue: '11232' },
        { name: 'hours', type: 'text', defaultValue: 'Mon–Fri · 9am – 7pm ET · On-location by appointment' },
      ],
    },
    {
      name: 'trustBanner',
      type: 'group',
      admin: {
        description:
          'The credibility strip under the hero on every industry page (src/components/TrustBanner.tsx) -- was fully hardcoded (rating text, tagline, and all 5 client logos on local /public files) until this field was added. Same idea as Home\'s trustSection, just a single-row layout with no flagship logos.',
      },
      fields: [
        { name: 'ratingText', type: 'text', defaultValue: '5.0/5 · 44 Google reviews' },
        { name: 'marqueeLabel', type: 'text', defaultValue: 'More collaborations & partnerships' },
        {
          name: 'clients',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'logo', type: 'upload', relationTo: 'media', required: true },
          ],
        },
      ],
    },
    {
      // 2026-09-24 handoff: short labels repeated across many pages were
      // typed into the components, so changing one meant a deploy.
      name: 'labels',
      type: 'group',
      admin: {
        description: 'Short bits of copy that repeat across pages. Change one here and every page that uses it updates.',
      },
      fields: [
        {
          name: 'trustLine',
          type: 'text',
          defaultValue: '174+ projects since 2023 · Replies within minutes',
          admin: { description: 'Small line under the button in every industry page hero.' },
        },
        {
          name: 'getStarted',
          type: 'text',
          defaultValue: 'Get Started',
          admin: { description: 'Industry page hero button, and the floating button bottom-right on industry pages.' },
        },
        {
          name: 'getStartedHref',
          type: 'text',
          defaultValue: '/contact',
          admin: { description: 'Where those "Get Started" buttons go.' },
        },
        {
          name: 'bookCall',
          type: 'text',
          defaultValue: 'Book a call',
          admin: { description: 'Button beside the service-cards heading on industry pages.' },
        },
        {
          name: 'bookThis',
          type: 'text',
          defaultValue: 'Book this',
          admin: { description: 'Link at the bottom of every service card.' },
        },
        {
          name: 'mostBooked',
          type: 'text',
          defaultValue: 'Most booked',
          admin: { description: 'Badge on the large featured service card.' },
        },
        {
          name: 'viewFullPortfolio',
          type: 'text',
          defaultValue: 'View Full Portfolio',
          admin: { description: 'Button under the project gallery.' },
        },
        {
          name: 'startProject',
          type: 'text',
          defaultValue: 'Start a project like this',
          admin: { description: 'Main button on an opened project card.' },
        },
        {
          name: 'backToReel',
          type: 'text',
          defaultValue: 'Back to the reel',
          admin: { description: 'Close button on an opened project card.' },
        },
        {
          name: 'exploreIndustry',
          type: 'text',
          defaultValue: 'Explore {industry} Work',
          admin: { description: 'Button in the /portfolio industry wheel. {industry} is replaced with the industry name.' },
        },
        {
          name: 'selectIndustry',
          type: 'text',
          defaultValue: 'Select Industry',
          admin: { description: 'Small label above the industry name in the middle of the /portfolio wheel.' },
        },
        {
          name: 'scrollCue',
          type: 'text',
          defaultValue: 'Scroll',
          admin: { description: 'Word over the bouncing arrow at the bottom of page heroes. Clear it to show just the arrow.' },
        },
      ],
    },
  ],
}
