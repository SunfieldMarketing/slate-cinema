import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-sqlite'

/*
  Baseline "checkpoint" migration -- this project ran on Payload's dev-mode
  schema push (auto-sync, no migration files) from day one, so there is no
  real migration history to inherit. `payload migrate:create` diffs the
  current Payload config against the LAST migration's .json snapshot, not
  against the live database (see @payloadcms/drizzle's buildCreateMigration
  -- generateDrizzleJson(this.schema) vs. the last committed snapshot file,
  falling back to an empty baseline when none exists). Run un-edited, this
  file's auto-generated body was a full `CREATE TABLE ...` for every
  existing collection/global -- which would fail on production, since those
  tables already exist there.

  So: up()/down() are deliberately no-ops. The accompanying
  20260819_203145_initial_schema_baseline.json snapshot is what actually
  matters -- it establishes "this is the schema as of today" as the diff
  baseline for every migration created after this one (starting with the
  useAPIKey addition). Running this migration in production just records a
  payload-migrations row (batch 1) marking the checkpoint; it changes
  nothing in the database itself.
*/
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Intentional no-op -- see comment above.
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Intentional no-op -- see comment above.
}
