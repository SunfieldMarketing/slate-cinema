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

    // Main-site look (2026-11-04, Oct 27 audit #29). The brief ships with its own Montserrat /
    // Hanken Grotesk type and a navy palette, so it read as a different site. Its stylesheet
    // is built on CSS variables, so one injected <style> re-themes it -- intake.html itself
    // stays byte-identical. Inter's @font-face rules are copied from this page (same-origin
    // font files), the navy tones become the site's ink, and --accent (which the app sets
    // inline at runtime, hence !important) becomes the brand colour.
    const restyle = () => {
      try {
        const doc = iframe.contentDocument
        if (!doc?.head || doc.getElementById('sc-site-theme')) return
        const faces: string[] = []
        for (const sheet of Array.from(document.styleSheets)) {
          let rules: CSSRuleList
          try { rules = sheet.cssRules } catch { continue }
          const base = sheet.href || location.href
          for (const rule of Array.from(rules)) {
            if (rule instanceof CSSFontFaceRule && /Inter/.test(rule.style.getPropertyValue('font-family'))) {
              // Font URLs are relative to the stylesheet; inside /intake.html they'd resolve
              // against the wrong path, so make them absolute first.
              faces.push(rule.cssText.replace(/url\((['"]?)([^'")]+)\1\)/g, (_m, q, u) => `url(${q}${new URL(u, base).href}${q})`))
            }
          }
        }
        const brand = getComputedStyle(document.documentElement).getPropertyValue('--color-brand-blue').trim() || '#00AEEF'
        const style = doc.createElement('style')
        style.id = 'sc-site-theme'
        style.textContent = `${faces.join('\n')}
:root, .sc-app {
  --display: 'Inter', 'Inter Fallback', system-ui, sans-serif !important;
  --body: 'Inter', 'Inter Fallback', system-ui, sans-serif !important;
  --navy-900: #0b0c0e !important; --navy-800: #101216 !important; --navy-700: #1b1e23 !important;
  --slate: #3b4048 !important;
  --accent: ${brand} !important;
}
.sc-step__title, .sc-hero__line, .sc-app h1, .sc-app h2 { font-weight: 900; letter-spacing: -0.04em; }
.sc-btn { border-radius: 999px; }
@media (min-width: 1100px) { .sc-card, .sc-app[data-layout="centered"] .sc-card { max-width: 780px; } }`
        doc.head.appendChild(style)
      } catch {
        // Cross-origin or not ready -- the brief still works in its original look.
      }
    }

    iframe.addEventListener('load', patch)
    iframe.addEventListener('load', restyle)
    // The iframe can finish loading before this effect runs (cached file).
    if (iframe.contentDocument?.readyState === 'complete') restyle()
    return () => {
      iframe.removeEventListener('load', patch)
      iframe.removeEventListener('load', restyle)
    }
  }, [])

  return (
    <iframe
      ref={iframeRef}
      src="/intake.html"
      title="Slate Cinema project intake brief"
      // Phones: fill the screen under the nav (the page's own padding in
      // contact/project/page.tsx is sized to match) so the intake's own
      // internal scroll is the only scroll. As a 75vh box inside a page
      // that also scrolled, its Continue/Back buttons sat ~330px below the
      // box's bottom edge on a 390x844 phone -- reachable only by scrolling
      // inside the small box, which read as the buttons being missing.
      className="block w-full h-[calc(100dvh-6rem-2px)] sm:h-[75vh] border-0"
    />
  )
}
