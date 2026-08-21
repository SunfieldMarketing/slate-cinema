import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sql } from '@payloadcms/db-sqlite'

/*
  TEMPORARY, read-only diagnostic route -- added 2026-08-20 to inspect the
  real (shared preview/production) database's actual schema state after
  the 20260820_233310_add_drafts_versions_live_preview migration failed
  partway through a build (index `industries_service_cards_deliverables_
  order_idx` already existed on a database that had never run this
  migration before). No other way to introspect the live Turso DB's raw
  schema/migration-history state exists from outside the running app.
  Returns table/index NAMES and payload_migrations rows only -- never row
  content. Gated by a one-time random token, not a persisted secret, and
  meant to be deleted again as soon as it's served its purpose -- do not
  leave this in place.
*/
const DIAG_TOKEN = 'x7k2m9-slate-diag-2026-08-20-qz4w8'

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token')
  if (token !== DIAG_TOKEN) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  try {
    const payload = await getPayload({ config })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = (payload.db as any).drizzle

    const tables = await db.all(
      sql`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`,
    )
    const indexes = await db.all(
      sql`SELECT name, tbl_name FROM sqlite_master WHERE type='index' ORDER BY name`,
    )
    let migrations: unknown = null
    try {
      migrations = await db.all(
        sql`SELECT id, name, batch, updated_at, created_at FROM payload_migrations ORDER BY id`,
      )
    } catch (e) {
      migrations = { error: e instanceof Error ? e.message : String(e) }
    }
    let industriesCols: unknown = null
    try {
      industriesCols = await db.all(sql`PRAGMA table_info(industries)`)
    } catch (e) {
      industriesCols = { error: e instanceof Error ? e.message : String(e) }
    }

    return NextResponse.json({
      tableCount: tables.length,
      tables: tables.map((t: { name: string }) => t.name),
      indexCount: indexes.length,
      indexes: indexes.map((i: { name: string; tbl_name: string }) => `${i.tbl_name}.${i.name}`),
      migrations,
      industriesCols,
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e), stack: e instanceof Error ? e.stack : undefined },
      { status: 500 },
    )
  }
}
