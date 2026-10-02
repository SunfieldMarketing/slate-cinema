import type { CollectionConfig, Condition } from 'payload'
import { revalidateCollectionAfterChange, revalidateCollectionAfterDelete } from '@/lib/revalidate'
import { sectionsField } from '@/blocks/builtin'

/*
  Matches src/lib/normalize.ts's IndustryData shape — the richest,
  most-edited content type on the site (one doc per industry, each
  driving its own /portfolio/[slug] page plus the Portfolio menu and the
  /portfolio wheel). `icon` is stored as a key into the lucide-react icon
  set in src/lib/icon-map.ts rather than a component reference.
*/
const ICON_OPTIONS = [
  'Film', 'Dumbbell', 'Plane', 'Building2', 'HeartPulse',
  'ShoppingBag', 'Briefcase', 'Users', 'GraduationCap',
  'Mic', 'Camera', 'Clapperboard', 'Music', 'Utensils', 'Car', 'House', 'Store', 'Megaphone', 'Sparkles',
].map((v) => ({ label: v, value: v }))

// The shape of the client's video, so its card frames it without black
// bars (Vimeo letterboxes a video that doesn't match its frame).
const ORIENTATION_OPTIONS = [
  { label: 'Landscape 16:9', value: 'landscape' },
  { label: 'Vertical 9:16 (reel / story)', value: 'portrait' },
  { label: 'Vertical 4:5 (feed post)', value: 'feed' },
  { label: 'Square 1:1', value: 'square' },
]

const vimeoHelp = 'Vimeo link or ID, e.g. https://vimeo.com/862067416 or just 862067416'

const whenRedirecting: Condition = (data) => Boolean(data?.redirectEnabled)

export const Industries: CollectionConfig = {
  slug: 'industries',
  // Drafts + Live Preview added 2026-08-20.
  versions: { drafts: true },
  // Also the default for every find() without an explicit sort -- the
  // Portfolio menu and the /portfolio wheel follow it.
  defaultSort: 'order',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'slug', 'order', 'accent'],
  },
  access: {
    // Public reads only ever see published content -- unpublished drafts
    // must stay invisible to real visitors until explicitly published.
    // Corrected 2026-08-24: this used to be a bare `() => true` (no
    // status check at all), which combined with the Local API's default
    // overrideAccess:true meant a saved-but-unpublished draft was visible
    // on the live public site immediately -- the opposite of what the
    // comment removed above claimed. See this session's e2eTest finding
    // (journalPostLifecycle.hiddenWhileDraft came back false).
    // payload-data.ts now threads overrideAccess: draft through every
    // call so this constraint actually applies to ordinary (draft:false)
    // visitors, while Live Preview (draft:true) passes overrideAccess:
    // true and bypasses it entirely, same as an authenticated admin
    // editing in /admin. Write operations still require a logged-in user
    // -- Payload defaults every unset access function to "allow
    // everyone," so create/update/delete must be explicit here or the
    // public REST/GraphQL API can write to this collection with no auth.
    read: ({ req }) => Boolean(req?.user) || { _status: { equals: 'published' } },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateCollectionAfterChange],
    afterDelete: [revalidateCollectionAfterDelete],
  },
  /*
    Field layout follows the industry page top to bottom. The collapsibles
    are admin-only grouping -- every field is still a top-level key on the
    document (data shape and DB columns are unaffected by them), which
    also keeps Live Preview's click-to-edit field ids stable.

    Everything visible on /portfolio/[slug] lives on this document. Until
    the 2026-09-24 handoff the client strip, the section headings, the
    statement video moment and the mid-page CTA were typed into the page
    templates (or code-only in src/lib/industries.ts), so every text change
    needed a deploy.
  */
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { description: 'Industry name: the page title, the Portfolio menu entry and the wheel slice.' },
    },
    {
      name: 'icon',
      type: 'select',
      required: true,
      options: ICON_OPTIONS,
      admin: { description: 'Shown next to the name in the Portfolio menu and in the /portfolio wheel.' },
    },
    { name: 'accent', type: 'text', required: true, admin: { description: 'Hex color, e.g. #00AEEF' } },
    {
      name: 'order',
      label: 'Menu position',
      type: 'number',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
        description: 'Position in the Portfolio menu and the /portfolio wheel. Lower numbers come first.',
      },
    },
    // Order/visibility of this page's sections + library sections in between.
    sectionsField('industry'),
    {
      type: 'collapsible',
      label: 'Hero',
      fields: [
        {
          name: 'stat',
          type: 'text',
          required: true,
          admin: {
            description:
              'Short tag, a few words (e.g. "Team & athlete films"). Shown as the small label above the page title, and on this industry\'s photo card in the /portfolio wheel.',
          },
        },
        {
          name: 'blurb',
          type: 'textarea',
          required: true,
          admin: { description: 'Subtitle under the page title. Also used in the /portfolio wheel.' },
        },
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Shown while the hero video loads, and on the /portfolio wheel card.' },
        },
        { name: 'heroVideo', type: 'upload', relationTo: 'media' },
        {
          name: 'heroVideoVimeoUrl',
          type: 'text',
          admin: { description: 'Paste a Vimeo URL or ID -- takes priority over the uploaded file when set' },
        },
        {
          name: 'stats',
          type: 'array',
          admin: { description: 'The animated numbers along the bottom of the hero.' },
          fields: [
            { name: 'value', type: 'number', required: true },
            { name: 'suffix', type: 'text' },
            { name: 'label', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Client strip',
      admin: { description: 'The client video cards right under the logo banner.' },
      fields: [
        {
          name: 'sectionEyebrow',
          label: 'Eyebrow',
          type: 'text',
          defaultValue: 'Who We Shoot For',
          admin: { description: 'Small label above the headline. Leave blank to hide it.' },
        },
        { name: 'sectionHeadline', label: 'Headline', type: 'text', admin: { description: 'Leave blank to hide it.' } },
        {
          name: 'sectionHeadlineAccent',
          label: 'Headline ending (italic)',
          type: 'text',
          admin: { description: 'Optional end of the headline, set in grey italics.' },
        },
        {
          name: 'clients',
          type: 'array',
          admin: {
            description:
              'One card per client. A card without a Vimeo video is hidden on the site, and the whole strip is hidden when no card has one.',
          },
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'year', type: 'text', admin: { description: 'Optional, e.g. "2025" or "2018–2021".' } },
            { name: 'description', type: 'textarea' },
            { name: 'vimeoId', label: 'Vimeo video', type: 'text', admin: { description: vimeoHelp } },
            { name: 'orientation', type: 'select', defaultValue: 'landscape', options: ORIENTATION_OPTIONS },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'What we make (service cards)',
      fields: [
        {
          name: 'servicesEyebrow',
          label: 'Eyebrow',
          type: 'text',
          defaultValue: 'What We Make',
          admin: { description: 'Leave blank to hide it.' },
        },
        { name: 'servicesHeadline', label: 'Headline', type: 'text', defaultValue: 'Ways it shows up' },
        {
          name: 'servicesHeadlineAccent',
          label: 'Headline ending (italic)',
          type: 'text',
          defaultValue: '— pick yours.',
          admin: { description: 'Optional end of the headline, set in grey italics.' },
        },
        {
          name: 'serviceCards',
          type: 'array',
          admin: { description: 'The service cards. The one marked "featured" runs large.' },
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
            { name: 'outcome', type: 'text', required: true, admin: { description: 'e.g. "+212% PDP conversion"' } },
            { name: 'deliverables', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
            { name: 'meta', type: 'text', admin: { description: 'e.g. "60–120s · 4–6 wks"' } },
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'video', type: 'upload', relationTo: 'media' },
            {
              name: 'videoVimeoUrl',
              type: 'text',
              admin: { description: 'Paste a Vimeo URL or ID -- takes priority over the uploaded file when set' },
            },
            { name: 'featured', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Statement (full-width video moment)',
      fields: [
        { name: 'statementEyebrow', label: 'Eyebrow', type: 'text' },
        {
          name: 'statementHeadline',
          label: 'Headline',
          type: 'textarea',
          admin: {
            description: 'One line per row; the last row is set in italics. Leave blank to hide the whole section.',
          },
        },
        { name: 'statementBody', label: 'Body', type: 'textarea' },
        {
          name: 'statementVideo',
          label: 'Background video',
          type: 'text',
          admin: { description: `Background video. ${vimeoHelp} (a video file URL also works).` },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Mid-page call to action',
      fields: [
        { name: 'ctaHeadline', label: 'Headline', type: 'text', defaultValue: 'Have a project like this in mind?' },
        {
          name: 'ctaSubhead',
          label: 'Subhead',
          type: 'text',
          defaultValue: '20 minutes, no pitch deck — just an honest read on scope, timeline and budget.',
        },
        { name: 'ctaButtonLabel', label: 'Button label', type: 'text', defaultValue: 'Get Started' },
        { name: 'ctaButtonHref', label: 'Button link', type: 'text', defaultValue: '/contact' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Timeline',
      fields: [
        {
          name: 'processEyebrow',
          label: 'Eyebrow',
          type: 'text',
          defaultValue: 'How It Works',
          admin: { description: 'Leave blank to hide it.' },
        },
        { name: 'processHeadline', label: 'Headline', type: 'text', defaultValue: 'The timeline,' },
        {
          name: 'processHeadlineAccent',
          label: 'Headline ending (italic)',
          type: 'text',
          defaultValue: 'concept to distribution.',
          admin: { description: 'Optional end of the headline, set in grey italics.' },
        },
        {
          name: 'process',
          type: 'array',
          admin: { description: 'The timeline steps.' },
          fields: [
            { name: 'week', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Project gallery',
      admin: { description: 'Heading over the grid of portfolio projects near the bottom of the page.' },
      fields: [
        {
          name: 'galleryEyebrow',
          label: 'Eyebrow',
          type: 'text',
          defaultValue: 'Our Work',
          admin: { description: 'Leave blank to hide it.' },
        },
        { name: 'galleryHeadline', label: 'Headline', type: 'text', defaultValue: 'A Gallery of Impact' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Send visitors to a sister brand instead',
      admin: {
        initCollapsed: true,
        description:
          'Replaces this whole page with a short message and one button to another website -- how Healthcare points to Wavecare.',
      },
      fields: [
        { name: 'redirectEnabled', type: 'checkbox', defaultValue: false, label: 'Show the sister-brand page instead' },
        { name: 'redirectEyebrow', label: 'Eyebrow', type: 'text', admin: { condition: whenRedirecting } },
        { name: 'redirectHeadline', label: 'Headline', type: 'text', admin: { condition: whenRedirecting } },
        { name: 'redirectBody', label: 'Message', type: 'textarea', admin: { condition: whenRedirecting } },
        { name: 'redirectButtonLabel', label: 'Button label', type: 'text', admin: { condition: whenRedirecting } },
        {
          name: 'redirectUrl',
          label: 'Website address',
          type: 'text',
          admin: { condition: whenRedirecting, description: 'Full address, e.g. https://wavecare.io' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'More (only used in specific places)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: { description: 'Search-engine description for this page (not shown on the page itself).' },
        },
        {
          name: 'videoTestimonials',
          type: 'array',
          admin: {
            description:
              'Video testimonial cards. Not shown on this page -- the homepage reviews section uses the first industry that has any.',
          },
          fields: [
            { name: 'quote', type: 'textarea', required: true },
            { name: 'name', type: 'text', required: true },
            { name: 'role', type: 'text', required: true },
            { name: 'company', type: 'text', required: true },
            { name: 'video', type: 'upload', relationTo: 'media', required: true },
            {
              name: 'videoVimeoUrl',
              type: 'text',
              admin: { description: 'Paste a Vimeo URL or ID -- takes priority over the uploaded file when set' },
            },
            { name: 'outcome', type: 'text', required: true },
            { name: 'poster', type: 'upload', relationTo: 'media' },
            { name: 'logo', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          name: 'gallery',
          type: 'array',
          admin: { description: 'Not currently shown on the site.' },
          fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
        },
        {
          name: 'services',
          type: 'array',
          admin: { description: 'Not currently shown on the site.' },
          fields: [{ name: 'name', type: 'text', required: true }],
        },
        {
          // Made fully optional 2026-08-12 — every existing value here was a
          // fabricated client quote (invented name/role/company), confirmed
          // via client audit and stripped from src/lib/industries.ts and its
          // render path. Subfields left not-required so the group itself can
          // be omitted entirely rather than forcing a partial/fake value.
          name: 'testimonial',
          type: 'group',
          admin: { description: 'Not currently shown on the site. Real client quotes only.' },
          fields: [
            { name: 'quote', type: 'textarea' },
            { name: 'name', type: 'text' },
            { name: 'role', type: 'text' },
            { name: 'company', type: 'text' },
          ],
        },
        {
          name: 'faqs',
          type: 'array',
          admin: { description: 'Not currently shown on the site.' },
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'textarea', required: true },
          ],
        },
      ],
    },
  ],
}
