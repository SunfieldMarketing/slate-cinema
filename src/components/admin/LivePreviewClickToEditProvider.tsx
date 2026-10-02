'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@payloadcms/ui'

/*
  Admin-side half of the Live Preview click-to-edit shortcut (see
  src/components/LivePreviewClickToEdit.tsx for the frontend half).
  Registered as an admin.components.providers entry in payload.config.ts
  so it wraps the whole admin app and can catch the postMessage
  regardless of which collection/global edit view is open.

  Field DOM ids follow Payload's own `generateFieldID` convention
  (@payloadcms/ui/dist/utilities/generateFieldID.js): `field-` + the
  field path with every "." replaced by "__". That's a stable, documented
  convention (used verbatim for FieldLabel's htmlFor and Checkbox's id),
  not a guess -- confirmed by reading the installed package directly
  rather than assuming a naming scheme.

  A click can only ever be resolved when it lands on the exact document
  currently open in the edit view -- the same rendered page can carry
  content from several different globals at once (e.g. the home page
  also renders Nav/Footer/Pipeline, which are separate globals), and
  Live Preview only ever has ONE of those open for editing at a time. A
  click on content from a different doc can't jump anywhere useful, so it
  surfaces a toast naming the right place instead of failing silently.
*/

type CmsFieldClickMessage = {
  type: 'slate-cms-field-click'
  field: string
  global?: string
  collection?: string
  docId?: string
}

function isCmsFieldClickMessage(data: unknown): data is CmsFieldClickMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as Record<string, unknown>).type === 'slate-cms-field-click' &&
    typeof (data as Record<string, unknown>).field === 'string'
  )
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 60))

/** Opens every collapsed array/blocks row along a field's path. Row ids are
    Payload's own: the parent path with dashes, then -row-<index> (the row
    holding "layout.1.items.0.*" is #layout-1-items-row-0). */
function openRowsAlongPath(parts: string[]): boolean {
  let opened = false
  for (let i = 1; i < parts.length; i++) {
    if (!/^\d+$/.test(parts[i])) continue
    const row = document.getElementById(`${parts.slice(0, i).join('-')}-row-${parts[i]}`)
    const toggle = row?.querySelector<HTMLButtonElement>('.collapsible__toggle')
    if (toggle?.classList.contains('collapsible__toggle--collapsed')) {
      toggle.click()
      opened = true
    }
  }
  return opened
}

/*
  Finds a field's input in the edit view, making it exist first. Payload
  only renders what an editor could see: rows of a list stay empty while
  collapsed (every row of a page's Sections list starts collapsed,
  2026-10-02), groups of fields render once scrolled within ~1000px, and a
  collapsed group of fields renders nothing. Opens rows along the path,
  brings unrendered field groups into view, and as a last resort opens
  collapsed field groups -- one step at a time, until the field appears.
*/
async function revealField(field: string): Promise<HTMLElement | null> {
  const domId = `field-${field.replace(/\./g, '__')}`
  const parts = field.split('.')
  const visited = new Set<Element>()
  for (let step = 0; step < 80; step++) {
    const el = document.getElementById(domId)
    if (el) return el
    if (openRowsAlongPath(parts)) {
      await tick()
      continue
    }
    const unrendered = Array.from(document.querySelectorAll<HTMLElement>('.render-fields')).find(
      (group) => !group.childElementCount && group.offsetParent && !visited.has(group),
    )
    if (unrendered) {
      visited.add(unrendered)
      unrendered.scrollIntoView({ block: 'center' })
      await tick()
      continue
    }
    const closedGroup = Array.from(
      document.querySelectorAll<HTMLElement>('.collapsible-field > .collapsible-field__collapsible.collapsible--collapsed'),
    ).find((group) => group.offsetParent && !visited.has(group))
    if (!closedGroup) break
    visited.add(closedGroup)
    closedGroup.querySelector<HTMLButtonElement>('.collapsible__toggle')?.click()
    await tick()
  }
  return null
}

function parseCurrentDoc(pathname: string): { global?: string; collection?: string; docId?: string } {
  const globalMatch = pathname.match(/\/admin\/globals\/([^/]+)/)
  if (globalMatch) return { global: globalMatch[1] }
  const collectionMatch = pathname.match(/\/admin\/collections\/([^/]+)\/([^/]+)/)
  if (collectionMatch) return { collection: collectionMatch[1], docId: collectionMatch[2] }
  return {}
}

export const LivePreviewClickToEditProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
    const focusField = async (field: string) => {
      const fieldEl = await revealField(field)
      if (!fieldEl) {
        toast.warning('Could not locate that field -- it may be inside a collapsed group, array row, or block.')
        return
      }

      fieldEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const focusable = fieldEl.matches('input, textarea, select, [contenteditable="true"]')
        ? fieldEl
        : fieldEl.querySelector<HTMLElement>('input, textarea, select, [contenteditable="true"]')
      focusable?.focus()

      const highlightTarget = fieldEl.closest<HTMLElement>('.field-type') || fieldEl
      const prevOutline = highlightTarget.style.outline
      const prevOffset = highlightTarget.style.outlineOffset
      highlightTarget.style.outline = '2px solid #00AEEF'
      highlightTarget.style.outlineOffset = '2px'
      setTimeout(() => {
        highlightTarget.style.outline = prevOutline
        highlightTarget.style.outlineOffset = prevOffset
      }, 1800)
    }

    const onMessage = (event: MessageEvent) => {
      if (!isCmsFieldClickMessage(event.data)) return
      const { field, global, collection, docId } = event.data
      const current = parseCurrentDoc(window.location.pathname)

      const sameDoc =
        (global && current.global === global) ||
        (collection && docId && current.collection === collection && current.docId === docId)

      if (!sameDoc) {
        const label = global ? `the "${global.replace(/-/g, ' ')}" global` : collection ? `this ${collection} item` : 'a different document'
        const href = global ? `/admin/globals/${global}` : collection && docId ? `/admin/collections/${collection}/${docId}` : undefined
        toast.info(`That content lives in ${label}, not the doc currently open.`, {
          action: href
            ? {
                label: 'Open it',
                onClick: () => router.push(href),
              }
            : undefined,
        })
        return
      }

      void focusField(field)
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [router])

  return <>{children}</>
}

export default LivePreviewClickToEditProvider
