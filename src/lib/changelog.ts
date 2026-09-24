import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  GlobalAfterChangeHook,
  GlobalConfig,
  PayloadRequest,
} from 'payload'

// Bookkeeping fields that change on every save (or are secrets) -- never
// worth a changelog line.
const IGNORED_KEYS = new Set([
  'updatedAt',
  'createdAt',
  'globalType',
  'collection',
  '_status',
  'hash',
  'salt',
  'password',
  'apiKey',
  'apiKeyIndex',
  'enableAPIKey',
  'resetPasswordToken',
  'resetPasswordExpiration',
  'loginAttempts',
  'lockUntil',
  'sessions',
  'sizes',
])
const MAX_DEPTH = 6
const MAX_FIELDS = 60
const MAX_VALUE_CHARS = 280

type Flat = Map<string, unknown>

function isRichText(v: unknown): boolean {
  return !!v && typeof v === 'object' && 'root' in (v as object)
}

// Relationship/upload values arrive populated (whole docs) on one side and
// as bare ids on the other depending on depth -- compare them by id.
function normalizeRef(v: unknown): unknown {
  if (v && typeof v === 'object' && !Array.isArray(v) && 'id' in v && ('createdAt' in v || 'filename' in v)) {
    return (v as { id: unknown }).id
  }
  return v
}

function flatten(value: unknown, prefix: string, out: Flat, depth: number) {
  // Never at the root: the saved doc itself has id + createdAt and would be
  // collapsed to just its id.
  const v = depth === 0 ? value : normalizeRef(value)
  if (v === null || v === undefined || typeof v !== 'object' || isRichText(v) || depth >= MAX_DEPTH) {
    if (prefix) out.set(prefix, v)
    return
  }
  if (Array.isArray(v)) {
    if (v.length === 0 && prefix) out.set(prefix, [])
    v.forEach((item, i) => flatten(item, prefix ? `${prefix}.${i}` : String(i), out, depth + 1))
    return
  }
  for (const [k, child] of Object.entries(v as Record<string, unknown>)) {
    if (IGNORED_KEYS.has(k)) continue
    // Doc ids never change; array-row ids are regenerated meaninglessly on reorder.
    if (k === 'id') continue
    flatten(child, prefix ? `${prefix}.${k}` : k, out, depth + 1)
  }
}

function describe(v: unknown): unknown {
  if (v === undefined) return null
  if (isRichText(v)) return '(rich text)'
  if (typeof v === 'string') return v.length > MAX_VALUE_CHARS ? `${v.slice(0, MAX_VALUE_CHARS)}…` : v
  if (v && typeof v === 'object') {
    const s = JSON.stringify(v)
    return s.length > MAX_VALUE_CHARS ? `${s.slice(0, MAX_VALUE_CHARS)}…` : v
  }
  return v
}

function diff(before: unknown, after: unknown) {
  const a: Flat = new Map()
  const b: Flat = new Map()
  flatten(before ?? {}, '', a, 0)
  flatten(after ?? {}, '', b, 0)
  const keys = new Set([...a.keys(), ...b.keys()])
  const changes: { field: string; before: unknown; after: unknown }[] = []
  for (const key of keys) {
    const x = a.get(key)
    const y = b.get(key)
    if (JSON.stringify(x ?? null) === JSON.stringify(y ?? null)) continue
    changes.push({ field: key, before: describe(x), after: describe(y) })
  }
  changes.sort((p, q) => p.field.localeCompare(q.field))
  return changes
}

function userOf(req: PayloadRequest) {
  const u = req.user as { id?: number | string; username?: string; email?: string } | null | undefined
  return {
    user: typeof u?.id === 'number' ? u.id : undefined,
    userName: u?.username || u?.email || 'System / script',
  }
}

function titleOf(doc: Record<string, unknown> | undefined, useAsTitle?: string): string | undefined {
  if (!doc) return undefined
  const t = (useAsTitle && doc[useAsTitle]) || doc.title || doc.name || doc.label || doc.filename || doc.username
  return typeof t === 'string' && t ? t : undefined
}

async function record(
  req: PayloadRequest,
  entry: {
    action: 'created' | 'updated' | 'published' | 'draft' | 'deleted'
    targetType: 'global' | 'collection'
    targetSlug: string
    targetLabel: string
    docId?: string
    docTitle?: string
    changes: { field: string; before: unknown; after: unknown }[]
  },
) {
  const { user, userName } = userOf(req)
  const fields = entry.changes.map((c) => c.field)
  const shown = fields.slice(0, 4).join(', ')
  const more = fields.length > 4 ? ` +${fields.length - 4} more` : ''
  const what = entry.docTitle ? `${entry.targetLabel} "${entry.docTitle}"` : entry.targetLabel
  const verb = { created: 'created', updated: 'updated', published: 'published', draft: 'saved a draft of', deleted: 'deleted' }[
    entry.action
  ]
  const summary = `${userName} ${verb} ${what}${fields.length && entry.action !== 'deleted' ? ` — ${shown}${more}` : ''}`
  try {
    await req.payload.create({
      collection: 'changelog',
      data: {
        summary: summary.slice(0, 500),
        action: entry.action,
        targetType: entry.targetType,
        targetSlug: entry.targetSlug,
        targetLabel: entry.targetLabel,
        docId: entry.docId,
        docTitle: entry.docTitle,
        user,
        userName,
        changedFields: fields.slice(0, MAX_FIELDS),
        changes: entry.changes.slice(0, MAX_FIELDS),
      },
      req,
      overrideAccess: true,
      depth: 0,
    })
  } catch (e) {
    // Logging must never be the reason a save fails.
    req.payload.logger.error({ err: e, msg: `changelog: failed to record ${entry.targetSlug} change` })
  }
}

function actionFor(operation: 'create' | 'update', doc: Record<string, unknown>, previousDoc?: Record<string, unknown>) {
  if (operation === 'create') return 'created' as const
  if (doc?._status === 'published' && previousDoc?._status !== 'published') return 'published' as const
  if (doc?._status === 'draft') return 'draft' as const
  return 'updated' as const
}

function labelOf(labels: unknown, slug: string): string {
  if (typeof labels === 'string') return labels
  if (labels && typeof labels === 'object' && 'en' in labels && typeof (labels as { en: unknown }).en === 'string') {
    return (labels as { en: string }).en
  }
  return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function withCollectionChangelog(config: CollectionConfig): CollectionConfig {
  const targetLabel = labelOf(config.labels?.singular, config.slug)
  const useAsTitle = config.admin?.useAsTitle

  const afterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
    const changes = diff(operation === 'create' ? {} : previousDoc, doc)
    const action = actionFor(operation, doc, previousDoc)
    if (!changes.length && action === 'updated') return doc
    await record(req, {
      action,
      targetType: 'collection',
      targetSlug: config.slug,
      targetLabel,
      docId: String(doc.id),
      docTitle: titleOf(doc, useAsTitle),
      changes,
    })
    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = async ({ doc, id, req }) => {
    await record(req, {
      action: 'deleted',
      targetType: 'collection',
      targetSlug: config.slug,
      targetLabel,
      docId: String(id),
      docTitle: titleOf(doc, useAsTitle),
      changes: [],
    })
    return doc
  }

  return {
    ...config,
    hooks: {
      ...config.hooks,
      afterChange: [...(config.hooks?.afterChange ?? []), afterChange],
      afterDelete: [...(config.hooks?.afterDelete ?? []), afterDelete],
    },
  }
}

export function withGlobalChangelog(config: GlobalConfig): GlobalConfig {
  const targetLabel = labelOf(config.label, config.slug)

  const afterChange: GlobalAfterChangeHook = async ({ doc, previousDoc, req }) => {
    const changes = diff(previousDoc, doc)
    const action = actionFor('update', doc, previousDoc)
    if (!changes.length && action === 'updated') return doc
    await record(req, { action, targetType: 'global', targetSlug: config.slug, targetLabel, changes })
    return doc
  }

  return {
    ...config,
    hooks: {
      ...config.hooks,
      afterChange: [...(config.hooks?.afterChange ?? []), afterChange],
    },
  }
}
