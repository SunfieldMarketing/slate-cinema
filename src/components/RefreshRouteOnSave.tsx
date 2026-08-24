'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/*
  Completes the Live Preview iframe wired up in payload.config.ts
  (admin.livePreview, added 2026-08-20) -- that config gives a real
  preview iframe + device-size toggle, but the frontend never actually
  listened for edits, so it only ever showed whatever was true at the
  moment the iframe first loaded (the comment on that config even says
  as much: "Needs the frontend to actually listen for live edits...
  see src/components/LivePreviewListener.tsx" -- a file that was never
  created).

  This site fetches all its content server-side in Server Components
  (no client-side data fetching for page content anywhere), so rather
  than pulling in @payloadcms/live-preview-react's useLivePreview hook
  (built for apps that hold page data in client state and merge partial
  field updates into it), this listens for Payload's own
  `payload-document-event` postMessage -- sent on every save/autosave/
  publish specifically so SSR apps can respond with a server
  round-trip -- and calls router.refresh(), which re-runs every Server
  Component on the current route against the latest saved data. Verified
  the exact message protocol directly from the installed
  @payloadcms/ui package (LivePreviewWindow) rather than assuming it:
  { type: 'payload-live-preview', ready: true } is the outbound
  handshake so the admin knows this iframe can receive events, and
  { type: 'payload-document-event' } is what arrives on each save.

  Mounted once in the root layout (not per-page) since it's a no-op
  outside of Payload's own live-preview iframe -- see the top-frame
  guard below -- so it costs a real site visitor nothing.
*/
export default function RefreshRouteOnSave() {
  const router = useRouter()

  useEffect(() => {
    // Only relevant inside Payload's live-preview iframe; a normal
    // visitor's tab is always its own top frame.
    if (typeof window === 'undefined' || window.self === window.top) return

    // Handshake -- tells the admin panel's LivePreviewProvider this
    // frame is ready to receive `payload-document-event`/
    // `payload-live-preview` messages (see appIsReady in
    // @payloadcms/ui's LivePreviewProvider).
    window.parent.postMessage({ type: 'payload-live-preview', ready: true }, '*')

    const onMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'object' && event.data.type === 'payload-document-event') {
        router.refresh()
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [router])

  return null
}
