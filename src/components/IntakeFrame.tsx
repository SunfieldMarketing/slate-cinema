'use client'

import { useEffect, useRef } from 'react'
import { pushConversion } from '@/lib/analytics'

/*
  Wraps the embedded /intake.html iframe (a self-contained bundled app --
  see the comment on the page that renders this) to mirror its submission
  into Payload's CMS, without touching that file at all.

  intake.html already POSTs straight to a real GHL webhook on submit
  (see WEBHOOK_URL in its bundled js_3_big.js source -- a
  services.leadconnectorhq.com URL, already wired, not something this
  session set up). This component leaves that entirely alone: same-origin
  access to the iframe lets us wrap `contentWindow.fetch` so the one call
  matching that GHL URL also fires a parallel copy at our own /api/intake
  (mirrors to Payload's form-submissions, visible at /admin) -- the
  original GHL request is always still sent, untouched, whether the
  mirror succeeds or fails.
*/
export default function IntakeFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const patch = () => {
      try {
        const win = iframe.contentWindow as (Window & { __scMirrorPatched?: boolean }) | null
        if (!win || win.__scMirrorPatched) return
        win.__scMirrorPatched = true

        const originalFetch = win.fetch.bind(win)
        win.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
          try {
            const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url
            if (url.includes('leadconnectorhq.com') && init?.method === 'POST' && typeof init.body === 'string') {
              const params = new URLSearchParams(init.body)
              const data: Record<string, string> = {}
              params.forEach((v, k) => { data[k] = v })
              // Fire-and-forget on the PARENT window (not the iframe's),
              // never awaited, never allowed to affect the real GHL call.
              fetch('/api/intake', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              }).catch(() => {})
              pushConversion('intake_submitted')
            }
          } catch {
            // Mirror is best-effort only -- never let it break the real submit.
          }
          return originalFetch(input as RequestInfo, init)
        }
      } catch {
        // Cross-origin or timing edge case -- GHL delivery is unaffected either way.
      }
    }

    iframe.addEventListener('load', patch)
    return () => iframe.removeEventListener('load', patch)
  }, [])

  return (
    <iframe
      ref={iframeRef}
      src="/intake.html"
      title="Slate Cinema project intake brief"
      className="block w-full h-[75vh] border-0"
    />
  )
}
