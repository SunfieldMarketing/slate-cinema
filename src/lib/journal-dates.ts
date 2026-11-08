/*
  Machine-readable dates for a Journal post (2026-11-07, Levi's AI-search list #7).

  A post's `date` field is display text ("July 2026"), and `createdAt` is when the document
  was created -- which for the posts imported on Aug 11 is the import, not the publication
  ("July 2026" posts created in August). So: the exact createdAt when it falls inside the
  displayed month, otherwise the first day of the displayed month. `modified` is the last
  real edit (updatedAt), never earlier than the published date.
*/

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

export interface PostDates {
  /** ISO date (YYYY-MM-DD) for <time datetime> and datePublished. */
  published: string
  /** Visible label: "September 25, 2026" when exact, else the display text ("July 2026"). */
  publishedLabel: string
  /** ISO date of the last edit, for dateModified. */
  modified: string
  /** Visible "Updated …" label, only when the post was edited after its publication day. */
  updatedLabel: string | null
}

const iso = (d: Date) => d.toISOString().slice(0, 10)
const long = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

export function postDates(post: { date: string; createdAt?: string; updatedAt?: string }): PostDates {
  const m = post.date?.trim().toLowerCase().match(/^([a-z]+)\s+(\d{4})$/)
  const monthIndex = m ? MONTHS.indexOf(m[1]) : -1
  const created = post.createdAt ? new Date(post.createdAt) : null
  const updated = post.updatedAt ? new Date(post.updatedAt) : null

  let published: Date
  let exact = false
  if (monthIndex >= 0 && m) {
    const year = Number(m[2])
    if (created && created.getUTCFullYear() === year && created.getUTCMonth() === monthIndex) {
      published = created
      exact = true
    } else {
      published = new Date(Date.UTC(year, monthIndex, 1))
    }
  } else {
    published = created ?? new Date(0)
    exact = Boolean(created)
  }

  const modified = updated && updated > published ? updated : published
  const editedLater = iso(modified) !== iso(published) && modified.getTime() - published.getTime() > 86_400_000
  return {
    published: iso(published),
    publishedLabel: exact ? long(published) : post.date,
    modified: iso(modified),
    updatedLabel: editedLater ? `Updated ${long(modified)}` : null,
  }
}
