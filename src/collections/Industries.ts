import type { CollectionConfig } from 'payload'

/*
  Matches src/lib/industries.ts's IndustryData shape exactly — the
  richest, most-edited content type on the site (9 industries, each
  driving its own /portfolio/[slug] page plus the homepage/nav routing).
  `icon` is stored as a key into the same lucide-react icon set the
  frontend already imports, rather than trying to store a component
  reference — see ICON_OPTIONS in src/seed/index.ts for the map.
*/
const ICON_OPTIONS = [
  'Film', 'Dumbbell', 'Plane', 'Building2', 'HeartPulse',
  'ShoppingBag', 'Briefcase', 'Users', 'GraduationCap',
].map((v) => ({ label: v, value: v }))

export const Industries: CollectionConfig = {
  slug: 'industries',
  // Drafts + Live Preview added 2026-08-20. read: () => true below needs
  // no change -- Payload only serves the published version on a plain
  // read; draft content only comes back when the request explicitly asks
  // for it (?draft=true), which is exactly what the admin preview iframe
  // does and a normal site visitor never would.
  versions: { drafts: true },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'slug', 'accent'],
  },
  access: {
    // Public read (consumed by the frontend site) -- write operations
    // require a logged-in user. Payload defaults every unset access
    // function to "allow everyone," so create/update/delete must be
    // explicit here or the public REST/GraphQL API can write to this
    // collection with no auth at all.
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'label', type: 'text', required: true },
    { name: 'icon', type: 'select', required: true, options: ICON_OPTIONS },
    { name: 'accent', type: 'text', required: true, admin: { description: 'Hex color, e.g. #00AEEF' } },
    { name: 'blurb', type: 'textarea', required: true, admin: { description: 'Short one-liner used by the industry wheel' } },
    { name: 'description', type: 'textarea', required: true, admin: { description: 'Longer paragraph used on the individual industry page' } },
    { name: 'stat', type: 'text', required: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'heroVideo', type: 'upload', relationTo: 'media' },
    {
      name: 'heroVideoVimeoUrl',
      type: 'text',
      admin: { description: 'Paste a Vimeo URL or ID -- takes priority over the uploaded file when set' },
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'suffix', type: 'text' },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'services',
      type: 'array',
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
      admin: { description: 'Optional — real client quote only, leave blank if none' },
      fields: [
        { name: 'quote', type: 'textarea' },
        { name: 'name', type: 'text' },
        { name: 'role', type: 'text' },
        { name: 'company', type: 'text' },
      ],
    },
    {
      name: 'serviceCards',
      type: 'array',
      admin: { description: 'Optional — rich bento cards for the individual industry page' },
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
    {
      name: 'videoTestimonials',
      type: 'array',
      admin: { description: 'Optional — video testimonial + case-study proof cards' },
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
      name: 'process',
      type: 'array',
      admin: { description: 'Optional — process timeline' },
      fields: [
        { name: 'week', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      admin: { description: 'Optional — FAQ accordion' },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    // clientShowcase / cinematicStatement ("the Athletics format",
    // 2026-08-13) deliberately NOT added here -- see the comment on
    // IndustryData.clientShowcase in src/lib/industries.ts for why
    // these two fields stay code-only (merged in normalize.ts) instead
    // of round-tripping through Payload + real media uploads, same as
    // how Athletics' own showcase was built before this generalization.
  ],
}
