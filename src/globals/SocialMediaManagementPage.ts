import type { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'

/*
  Brings /social-media-management into the CMS -- previously fully
  hardcoded (see that page's own header comment: "Ported verbatim...
  the copy is legally reviewed to ship as-is, not paraphrased" -- this
  page's existence/reachability is itself a TikTok Content Posting API
  approval requirement).

  `hero.lede` and `howItWorks.steps.*.body` are richText rather than
  plain text specifically because the original copy has real inline
  formatting inside otherwise-plain sentences (a bolded clause in the
  lede, a bolded clause in step 2's body) that a plain textarea would
  silently drop. `hero.headlineEmphasis` stays a separate field from
  `hero.headlineText` because the design renders it as a distinct
  colored/italic run (the page's own <em> element), not just a stylistic
  accident of the sentence -- same reasoning as HomePage's
  headlineLine1/headlineLine2 split elsewhere in this config.
*/
export const SocialMediaManagementPage: GlobalConfig = {
  slug: 'social-media-management-page',
  admin: { group: 'Pages' },
  versions: { drafts: true },
  access: {
    read: ({ req }) => Boolean(req?.user) || { _status: { equals: 'published' } },
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Distribution · Always On' },
        {
          name: 'headlineText',
          type: 'text',
          required: true,
          defaultValue: 'We run social media for businesses that need to',
        },
        {
          name: 'headlineEmphasis',
          type: 'text',
          required: true,
          admin: { description: 'Rendered as the emphasized/colored run at the end of the headline.' },
          defaultValue: 'focus on operations.',
        },
        { name: 'lede', type: 'richText', editor: lexicalEditor(), required: true },
      ],
    },
    {
      name: 'howItWorks',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'How it works' },
        {
          name: 'steps',
          type: 'array',
          minRows: 1,
          admin: { description: 'Numbered 01, 02, 03... automatically by position -- no separate number field needed.' },
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'richText', editor: lexicalEditor(), required: true },
          ],
        },
      ],
    },
    {
      name: 'included',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: "What's included" },
        {
          name: 'items',
          type: 'array',
          minRows: 1,
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'monoTag', type: 'text', defaultValue: 'Now scheduling' },
        { name: 'heading', type: 'text', defaultValue: 'One calendar. One approval. Action.' },
        {
          name: 'body',
          type: 'textarea',
          defaultValue: "Tell us about your business and what you want your social to do — we'll get back to you with a plan.",
        },
        { name: 'buttonLabel', type: 'text', defaultValue: 'Schedule a call' },
        { name: 'buttonHref', type: 'text', defaultValue: '/schedule-a-call' },
        {
          name: 'altText',
          type: 'text',
          defaultValue: 'Or email',
          admin: { description: 'Prefix shown before the email address, which is pulled from Site Settings > Contact.' },
        },
      ],
    },
  ],
}
