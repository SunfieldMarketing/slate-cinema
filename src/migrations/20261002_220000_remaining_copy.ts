import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/*
  The last copy that was typed into components (2026-10-02 sweep):

  - Contact Page > Lead form > Form labels: the quick-message form's field
    labels, placeholders and the heading of its thank-you note.
  - Footer > Newsletter > Success message.
  - Site Settings > Labels: "Scroll" (hero scroll cue) and "Select
    Industry" (middle of the /portfolio wheel).
  - How It Works > Hero > Storyboard text: the four scene captions, the
    edit-scene hint and the closing call to action.

  Plain text columns whose default is the exact wording on the live site,
  which SQLite applies to the existing rows -- nothing visible changes.
  DDL is exactly what Payload's schema push generates for the new config.
  Idempotent: duplicate columns are tolerated.
*/

type MigrationDB = MigrateUpArgs['db']

function errorText(e: unknown): string {
  const err = e as { message?: unknown; cause?: { message?: unknown } } | null
  return [err, err?.message, err?.cause, err?.cause?.message].filter(Boolean).map(String).join(' | ')
}

const quote = (value: string) => `'${value.replace(/'/g, "''")}'`

/** Document table -> its new columns and their (current) wording. */
const COLUMNS: Record<string, [string, string][]> = {
  contact_page: [
    ['lead_form_name_label', 'Name *'],
    ['lead_form_name_placeholder', 'Jane Doe'],
    ['lead_form_company_label', 'Company'],
    ['lead_form_company_placeholder', 'Optional'],
    ['lead_form_email_label', 'Email *'],
    ['lead_form_email_placeholder', 'jane@company.com'],
    ['lead_form_phone_label', 'Phone *'],
    ['lead_form_phone_placeholder', '(555) 000-0000'],
    ['lead_form_message_label', 'Message'],
    ['lead_form_message_placeholder', 'One line on what you have in mind (optional)'],
    ['lead_form_success_title', 'Thanks — we’re on it.'],
  ],
  footer: [['newsletter_success_message', 'Thanks — you’re on the list.']],
  site_settings: [
    ['labels_select_industry', 'Select Industry'],
    ['labels_scroll_cue', 'Scroll'],
  ],
  how_it_works_page: [
    ['hero_storyboard_pre_production_caption', 'Every project starts on the board.'],
    ['hero_storyboard_production_caption', 'On set, it all comes together.'],
    ['hero_storyboard_post_production_caption', 'Then it all takes shape in the edit.'],
    ['hero_storyboard_edit_hint', 'Scroll scrubs the edit · drag the playhead'],
    ['hero_storyboard_distribution_caption', 'Then it goes everywhere at once.'],
    ['hero_storyboard_closing_headline', "Let's make something great."],
    [
      'hero_storyboard_closing_text',
      "Every project starts with a conversation — reach out and we'll walk you through exactly how it works.",
    ],
  ],
}

async function addColumn(db: MigrationDB, table: string, column: string, value: string) {
  try {
    await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD \`${column}\` text DEFAULT ${quote(value)};`))
  } catch (e) {
    if (!errorText(e).includes('duplicate column name')) throw e
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const [table, columns] of Object.entries(COLUMNS)) {
    for (const [column, value] of columns) {
      await addColumn(db, table, column, value)
      await addColumn(db, `_${table}_v`, `version_${column}`, value)
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const [table, columns] of Object.entries(COLUMNS)) {
    for (const [column] of columns) {
      for (const [target, name] of [
        [table, column],
        [`_${table}_v`, `version_${column}`],
      ]) {
        try {
          await db.run(sql.raw(`ALTER TABLE \`${target}\` DROP COLUMN \`${name}\`;`))
        } catch (e) {
          if (!errorText(e).includes('no such column')) throw e
        }
      }
    }
  }
}
