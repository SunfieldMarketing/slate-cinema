import type { Field } from 'payload'
import { ICON_MAP } from '@/lib/icon-map'

/*
  Building pieces shared by every page-builder block (src/blocks/index.ts).
  Labels and descriptions are written for whoever edits the site in
  /admin, not for developers.
*/

export const vimeoHelp = 'Vimeo link or ID, e.g. https://vimeo.com/862067416 or just 862067416'

export const ICON_OPTIONS = Object.keys(ICON_MAP).map((v) => ({ label: v, value: v }))

/** Eyebrow / headline / italic ending / intro, used at the top of most sections. */
export const headingField: Field = {
  name: 'heading',
  type: 'group',
  label: 'Heading',
  fields: [
    { name: 'eyebrow', label: 'Eyebrow', type: 'text', admin: { description: 'Small label above the headline. Optional.' } },
    { name: 'headline', label: 'Headline', type: 'text' },
    {
      name: 'headlineAccent',
      label: 'Headline ending (italic)',
      type: 'text',
      admin: { description: 'Optional end of the headline, set in grey italics.' },
    },
    { name: 'intro', label: 'Intro text', type: 'textarea' },
  ],
}

/** An image and/or video. Vimeo beats the uploaded file when both are set. */
export const mediaFields = (imageDescription = 'Shown while the video loads, or on its own if there is no video.'): Field[] => [
  { name: 'image', label: 'Image', type: 'upload', relationTo: 'media', admin: { description: imageDescription } },
  { name: 'video', label: 'Video file', type: 'upload', relationTo: 'media' },
  {
    name: 'vimeo',
    label: 'Vimeo video',
    type: 'text',
    admin: { description: `${vimeoHelp}. Takes priority over the video file.` },
  },
]

export const buttonsField = (maxRows = 2): Field => ({
  name: 'buttons',
  type: 'array',
  label: 'Buttons',
  maxRows,
  admin: { initCollapsed: true },
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'href',
      label: 'Link',
      type: 'text',
      required: true,
      admin: { description: 'A page on this site ("/contact", "/services#pricing") or a full address ("https://...").' },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Solid', value: 'primary' },
        { label: 'Outline', value: 'secondary' },
      ],
    },
  ],
})

/**
 * Section-level settings every block gets, tucked into a collapsed panel:
 * hide without deleting, hide on one device size, an anchor for #links,
 * and a per-section accent color.
 */
export const sectionSettings: Field = {
  type: 'collapsible',
  label: 'Section settings',
  admin: { initCollapsed: true },
  fields: [
    {
      name: 'hidden',
      label: 'Hide this section',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Keeps the section here but stops it showing on the site.' },
    },
    {
      name: 'hideOn',
      label: 'Hide on',
      type: 'select',
      options: [
        { label: 'Phones only', value: 'mobile' },
        { label: 'Computers only', value: 'desktop' },
      ],
    },
    {
      name: 'anchor',
      label: 'Anchor name',
      type: 'text',
      admin: { description: 'Lets a button jump straight here: "pricing" makes /this-page#pricing work. Letters, numbers and dashes.' },
    },
    {
      name: 'accent',
      label: 'Accent color',
      type: 'text',
      admin: { description: 'Hex color for this section, e.g. #f97316. Leave blank to use the page color.' },
    },
  ],
}
