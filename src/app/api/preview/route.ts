import { draftMode } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

/*
  Enables Next.js Draft Mode (a signed, httpOnly cookie -- readable from
  ANY server component including layout.tsx, unlike a ?draft=true query
  param which page.tsx can read but layout.tsx cannot) and redirects to
  the requested path. payload.config.ts's livePreviewURL routes every
  Live Preview iframe through here instead of linking straight to the
  page, specifically so shared/site-wide globals rendered in the root
  layout (Navigation, Footer, SiteSettings -- e.g. TrustBanner) also
  reflect an in-progress draft, not just the page-specific content a
  plain query param could reach.

  Deliberately no secret/token gate: draft content here is unpublished
  marketing copy, not user data, and enabling it only affects the
  visiting browser's own session (the cookie is per-visitor) -- worst
  case an unauthenticated visitor manually hits this route and sees a
  draft instead of the published page, same risk profile as any
  ordinary preview link. Add a shared-secret check here later if that
  ever needs tightening.
*/
export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path') || '/'
  // Only ever redirect to a same-site relative path -- never let this
  // become an open redirect via an attacker-supplied absolute URL.
  const safePath = path.startsWith('/') && !path.startsWith('//') ? path : '/'
  const dm = await draftMode()
  dm.enable()
  return NextResponse.redirect(new URL(safePath, req.url))
}
