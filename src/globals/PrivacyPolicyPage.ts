import type { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'

/*
  Brings /privacy-policy into the CMS -- previously fully hardcoded (see
  src/app/(frontend)/privacy-policy/page.tsx's own header comment: "Ported
  verbatim... Copy is legally reviewed to ship as-is"). `body` as a single
  richText field rather than one field per heading/paragraph -- this is a
  real legal document that reads as continuous prose with headings/lists/
  inline links, not a set of independently-reorderable content blocks, so
  matching the JournalPosts.content pattern (one richText field) is the
  right level of granularity: editable end-to-end, without inventing dozens
  of brittle per-paragraph fields that would drift from the document's
  actual structure the first time legal counsel asks for a wording change.
  title/dateline stay separate plain-text fields since those genuinely are
  independent, frequently-updated pieces (the date changes every revision).
*/
export const PrivacyPolicyPage: GlobalConfig = {
  slug: 'privacy-policy-page',
  versions: { drafts: true },
  access: {
    // Same pattern as every other global -- see Industries.ts for the
    // full rationale (public reads only ever see published content).
    read: ({ req }) => Boolean(req?.user) || { _status: { equals: 'published' } },
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    { name: 'title', type: 'text', required: true, defaultValue: 'Privacy Policy' },
    { name: 'dateline', type: 'text', required: true, defaultValue: 'Last updated · 6 August 2026' },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor(),
      required: true,
      admin: { description: 'The full policy -- headings, paragraphs, lists, and links all live here as one document.' },
    },
  ],
}
