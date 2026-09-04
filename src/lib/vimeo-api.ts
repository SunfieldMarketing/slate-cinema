/*
  Real Vimeo Data API client -- server-side only.

  Distinct from vimeo.ts (which only builds a player.vimeo.com *embed* URL
  from an ID an editor already typed in). This module actually calls
  api.vimeo.com to pull real metadata/thumbnails/embed HTML for Jake's
  library, using the Personal Access Token he generated for this exact
  purpose (Slack #web-development, 2026-08-25, "Vimeo API is set up --
  ready for the portfolio build"; full handoff doc: KAUAN-VIMEO-HANDOFF.md).

  Token facts (from that handoff -- keep this file's behavior consistent
  with them):
  - App: "Slate Cinema Website" (App ID 542626), owner Jake Kamensky.
  - Scopes: `public private video_files` -- read-only on purpose. No edit/
    delete/upload/create. If something genuinely needs write access, ask
    Jake before regenerating with broader scopes.
  - 394 videos total; privacy mix includes unlisted/private/password-
    protected entries alongside public ones -- ALWAYS filter to
    privacy.view === 'anybody' before showing anything to a site visitor,
    so an unlisted client cut can't accidentally surface. Every function
    below that returns a list already applies this filter; if you add a
    new one, apply it there too rather than trusting the caller to.
  - Account tier is Vimeo Plus. `files` (direct MP4 renditions) is
    documented as Pro-and-above -- expect it to come back empty and fall
    back to the player embed (vimeoEmbedUrl in vimeo.ts) or `pictures`
    for thumbnails. That's the account tier, not a bug in this client.
  - Token is server-side only. It can read private videos, so it must
    NEVER ship to the browser or land in a NEXT_PUBLIC_ env var -- every
    function here is safe to call only from Server Components, Route
    Handlers, or other server-only code.

  Caching: Jake's own note -- "cache responses rather than calling per
  page view." Every request below sets Next's `fetch` cache with a
  revalidate window rather than `no-store`, so repeat page loads within
  that window hit Next's data cache instead of Vimeo. 6 hours by default
  (this is a portfolio of finished client work, not something that
  changes minute-to-minute) -- pass `revalidateSeconds` to override per
  call if a particular use ever needs fresher data.
*/

const VIMEO_API_BASE = 'https://api.vimeo.com'
const DEFAULT_REVALIDATE_SECONDS = 6 * 60 * 60 // 6 hours

export interface VimeoVideoSummary {
  uri: string
  id: string
  name: string
  description: string | null
  duration: number
  thumbnailUrl: string | null
  privacyView: string
  createdTime: string
}

export interface VimeoVideoDetail extends VimeoVideoSummary {
  embedHtml: string | null
  fileUrl: string | null // direct MP4, only present on Pro+ accounts -- see header note
}

class VimeoConfigError extends Error {
  constructor() {
    super(
      'VIMEO_ACCESS_TOKEN is not set. Get the token from Jake (sent out-of-band, ' +
        'not in Slack -- see KAUAN-VIMEO-HANDOFF.md) and set it server-side only, ' +
        'never as a NEXT_PUBLIC_ var.'
    )
    this.name = 'VimeoConfigError'
  }
}

function getToken(): string {
  const token = process.env.VIMEO_ACCESS_TOKEN
  if (!token) throw new VimeoConfigError()
  return token
}

async function vimeoFetch(path: string, revalidateSeconds: number): Promise<unknown> {
  const token = getToken()
  const res = await fetch(`${VIMEO_API_BASE}${path}`, {
    headers: {
      Authorization: `bearer ${token}`,
      Accept: 'application/vnd.vimeo.*+json;version=3.4',
    },
    next: { revalidate: revalidateSeconds },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Vimeo API ${res.status} on ${path}: ${body.slice(0, 300)}`)
  }
  return res.json()
}

function pickThumbnail(pictures: unknown): string | null {
  const sizes = (pictures as { sizes?: { link: string; width: number }[] } | undefined)?.sizes
  if (!sizes || sizes.length === 0) return null
  // Largest available, capped -- these feed <img>, not a lightbox, no need
  // for Vimeo's biggest (often 1920w+) renditions.
  const usable = sizes.filter((s) => s.width <= 1280)
  const best = (usable.length ? usable : sizes).sort((a, b) => b.width - a.width)[0]
  return best?.link ?? null
}

interface RawVimeoVideo {
  uri: string
  name: string
  description: string | null
  duration: number
  pictures?: unknown
  privacy?: { view?: string }
  created_time: string
  files?: { link: string; quality: string; type: string }[]
  embed?: { html: string }
}

function toSummary(v: RawVimeoVideo): VimeoVideoSummary {
  return {
    uri: v.uri,
    id: v.uri.replace('/videos/', ''),
    name: v.name,
    description: v.description,
    duration: v.duration,
    thumbnailUrl: pickThumbnail(v.pictures),
    privacyView: v.privacy?.view ?? 'unknown',
    createdTime: v.created_time,
  }
}

/*
  Full library listing, paginated transparently (Vimeo caps per_page at
  100). Filters to privacy.view === 'anybody' before returning -- see the
  header note on why that's non-negotiable for anything the public site
  renders. Pass a smaller `limit` while prototyping a page against the
  real library instead of pulling all 394 every time.
*/
export async function listPublicVideos(options?: {
  limit?: number
  revalidateSeconds?: number
}): Promise<VimeoVideoSummary[]> {
  const revalidateSeconds = options?.revalidateSeconds ?? DEFAULT_REVALIDATE_SECONDS
  const fields = 'uri,name,description,duration,pictures.sizes,privacy.view,created_time'
  const out: VimeoVideoSummary[] = []
  let page = 1
  const perPage = 100
  while (true) {
    const data = (await vimeoFetch(
      `/me/videos?per_page=${perPage}&page=${page}&fields=${fields}`,
      revalidateSeconds
    )) as { data: RawVimeoVideo[]; paging?: { next?: string | null } }
    for (const v of data.data) {
      if (v.privacy?.view === 'anybody') out.push(toSummary(v))
      if (options?.limit && out.length >= options.limit) return out.slice(0, options.limit)
    }
    if (!data.paging?.next) break
    page++
  }
  return out
}

/*
  Single video, with embed HTML and (Pro+ only, see header note) a direct
  file URL. Returns null -- not throws -- for a private/unlisted/missing
  video so a page can fall back to its existing hardcoded video/poster
  instead of crashing the render.
*/
export async function getPublicVideo(
  id: string,
  revalidateSeconds = DEFAULT_REVALIDATE_SECONDS
): Promise<VimeoVideoDetail | null> {
  const fields = 'uri,name,description,duration,pictures.sizes,privacy.view,created_time,files,embed.html'
  let v: RawVimeoVideo
  try {
    v = (await vimeoFetch(`/videos/${id}?fields=${fields}`, revalidateSeconds)) as RawVimeoVideo
  } catch {
    return null
  }
  if (v.privacy?.view !== 'anybody') return null
  const mp4Files = (v.files ?? []).filter((f) => f.type === 'video/mp4')
  const bestFile = mp4Files.sort((a, b) => {
    const rank = (q: string) => ({ hd: 3, sd: 2, mobile: 1 })[q] ?? 0
    return rank(b.quality) - rank(a.quality)
  })[0]
  return {
    ...toSummary(v),
    embedHtml: v.embed?.html ?? null,
    fileUrl: bestFile?.link ?? null,
  }
}
