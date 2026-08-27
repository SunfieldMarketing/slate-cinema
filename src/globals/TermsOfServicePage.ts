import type { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'

/*
  Brings /terms-of-service into the CMS -- same rationale as
  PrivacyPolicyPage.ts (see that file's comment): one richText `body`
  field for the whole legally-reviewed document, plus independent
  title/dateline fields.
*/
export const TermsOfServicePage: GlobalConfig = {
  slug: 'terms-of-service-page',
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
    { name: 'title', type: 'text', required: true, defaultValue: 'Terms of Service' },
    { name: 'dateline', type: 'text', required: true, defaultValue: 'Last updated · 6 August 2026' },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor(),
      required: true,
      admin: { description: 'The full terms -- headings, paragraphs, and links all live here as one document.' },
    },
  ],
}
