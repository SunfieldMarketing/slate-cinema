import type { Field } from 'payload'

/*
  "Search engines & sharing" (2026-10-02): the title and description search
  results and link previews show for a page, its share image, and a switch
  to keep it out of search engines. Every field is optional -- blank means
  the page's own default, shown as the field's placeholder where there is
  a fixed one. Read by src/lib/seo.ts.
*/
export function seoFields({
  title,
  titleHint = 'Shown in the browser tab, search results and link previews. Leave blank to use the text shown.',
  description,
  descriptionHint = 'The snippet under the title in search results and link previews. Leave blank to use the text shown.',
  imageHint = 'Shown when the page is shared in messages or on social media. Leave empty to use the share image in Site Settings > SEO.',
}: {
  /** Default title, shown greyed out in the empty field. */
  title?: string
  titleHint?: string
  /** Default description, shown greyed out in the empty field. */
  description?: string
  descriptionHint?: string
  imageHint?: string
} = {}): Field {
  return {
    type: 'collapsible',
    label: 'Search engines & sharing',
    admin: { initCollapsed: true },
    fields: [
      { name: 'metaTitle', label: 'Search title', type: 'text', admin: { placeholder: title, description: titleHint } },
      {
        name: 'metaDescription',
        label: 'Search description',
        type: 'textarea',
        admin: { placeholder: description, description: descriptionHint },
      },
      { name: 'metaImage', label: 'Share image', type: 'upload', relationTo: 'media', admin: { description: imageHint } },
      {
        name: 'noIndex',
        label: 'Hide from search engines',
        type: 'checkbox',
        defaultValue: false,
        admin: { description: 'Asks search engines not to list this page, and leaves it out of the sitemap.' },
      },
    ],
  }
}
