'use client'

import { useEffect } from 'react'

/*
  Click-to-edit shortcut for Live Preview -- requested 2026-08-25 alongside
  the blank-/admin bug report. Content on the site carries `data-cms-*`
  attributes identifying which Payload field it came from (see the
  data-cms-field/-global/-collection/-doc-id attributes added to Nav,
  Footer, FinalCTA, etc.); this listens for clicks on that content while
  rendered inside Payload's Live Preview iframe and posts the resolved
  field path up to the admin panel, where LivePreviewClickToEditProvider
  (src/components/admin/LivePreviewClickToEditProvider.tsx) scrolls to and
  focuses the matching form field.

  Same iframe-only guard as RefreshRouteOnSave.tsx (window.self ===
  window.top means a real visitor's own top-level tab, not the preview
  frame) so this is a genuine no-op outside of /admin's Live Preview panel
  -- a real site visitor never has a click listener attached, never sees
  the hover outline CSS below, and this component doesn't even mount its
  effect. Mounted once in the root layout, same as RefreshRouteOnSave.
*/

type CmsTarget = {
  field: string
  global?: string
  collection?: string
  docId?: string
}

function resolveCmsTarget(start: Element): CmsTarget | null {
  let node: Element | null = start
  let field: string | undefined
  let global: string | undefined
  let collection: string | undefined
  let docId: string | undefined

  while (node && node !== document.documentElement) {
    const ds = (node as HTMLElement).dataset
    if (ds) {
      if (!field && ds.cmsField) field = ds.cmsField
      if (!global && ds.cmsGlobal) global = ds.cmsGlobal
      if (!collection && ds.cmsCollection) collection = ds.cmsCollection
      if (!docId && ds.cmsDocId) docId = ds.cmsDocId
    }
    if (field && (global || (collection && docId))) break
    node = node.parentElement
  }

  return field ? { field, global, collection, docId } : null
}

export default function LivePreviewClickToEdit() {
  useEffect(() => {
    if (typeof window === 'undefined' || window.self === window.top) return

    // Hover affordance so editors can see what's clickable before they
    // click -- scoped to the iframe only via the guard above, never
    // injected into a real visitor's page.
    const style = document.createElement('style')
    style.textContent = `
      [data-cms-field] { cursor: pointer; }
      [data-cms-field]:hover { outline: 2px dashed #00AEEF; outline-offset: 2px; }
      .cms-click-flash { outline: 2px solid #00AEEF !important; outline-offset: 2px; transition: outline-color 0.2s ease; }
    `
    document.head.appendChild(style)

    const onClick = (e: MouseEvent) => {
      const el = e.target as Element | null
      if (!el) return
      const target = resolveCmsTarget(el)
      if (!target) return

      e.preventDefault()
      e.stopPropagation()

      const flashEl = el.closest('[data-cms-field]')
      if (flashEl) {
        flashEl.classList.add('cms-click-flash')
        setTimeout(() => flashEl.classList.remove('cms-click-flash'), 600)
      }

      window.parent.postMessage({ type: 'slate-cms-field-click', ...target }, '*')
    }

    // Capture phase so this runs before a Link's own navigation handler.
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      style.remove()
    }
  }, [])

  return null
}
