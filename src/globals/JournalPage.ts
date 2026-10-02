import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'
import { sectionsField } from '@/blocks/builtin'

/*
  Brings the /journal index page and the shared bits around every journal
  post into the CMS (2026-10-01, "make every piece of site copy editable").
  The posts themselves were already the Journal Posts collection; this
  covers the index hero and the copy that wraps each post, which was the
  last page on the site with no CMS document at all.
*/
export const JournalPage: GlobalConfig = {
  slug: 'journal-page',
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
    // Order/visibility of this page's sections + library sections in between.
    sectionsField('journal'),
    {
      name: 'hero',
      type: 'group',
      admin: { description: 'Top of the /journal page.' },
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'The Slate Journal' },
        { name: 'titleLine1', type: 'text', defaultValue: 'What it takes' },
        { name: 'titleLine2', type: 'text', defaultValue: 'to get watched' },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue:
            'Field notes from inside our own production process — on story, strategy, and the craft decisions that decide whether someone keeps watching or scrolls past.',
        },
      ],
    },
    {
      name: 'readLabel',
      type: 'text',
      defaultValue: 'Read the piece',
      admin: { description: 'Link at the bottom of each post card on /journal.' },
    },
    {
      name: 'postCta',
      type: 'group',
      admin: { description: 'Call to action at the end of every journal post.' },
      fields: [
        { name: 'headline', type: 'text', defaultValue: 'Have a project in mind?' },
        {
          name: 'subhead',
          type: 'text',
          defaultValue: "Tell us where you're at and we'll point you to the right next step.",
        },
        { name: 'buttonLabel', type: 'text', defaultValue: 'Get Started' },
        { name: 'buttonHref', type: 'text', defaultValue: '/contact' },
      ],
    },
    {
      name: 'relatedLabel',
      type: 'text',
      defaultValue: 'More from the Journal',
      admin: { description: 'Label over the related posts at the bottom of every journal post.' },
    },
  ],
}
