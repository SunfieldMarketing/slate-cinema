import { draftMode } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

// Turns Draft Mode back off. Not wired to any UI button yet (the site
// has no "exit preview" affordance), but this is the standard paired
// route Next.js's own docs expect alongside /api/preview -- included so
// a future "Exit Preview" link/banner has somewhere to go without
// needing its own new route.
export async function GET(req: NextRequest) {
  const dm = await draftMode()
  dm.disable()
  const path = req.nextUrl.searchParams.get('path') || '/'
  const safePath = path.startsWith('/') && !path.startsWith('//') ? path : '/'
  return NextResponse.redirect(new URL(safePath, req.url))
}
