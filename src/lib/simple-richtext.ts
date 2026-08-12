/**
 * Minimal valid Lexical editor-state JSON for a single plain-text
 * paragraph. Used wherever code (not an admin user) needs to supply a
 * `richText` field value programmatically -- e.g. the auto-created
 * `forms` docs in the API routes under src/app/api/, whose
 * `confirmationMessage` is required by @payloadcms/plugin-form-builder
 * whenever `confirmationType: 'message'`. Mirrors the shape already
 * proven working for Journal post bodies in src/seed/index.ts.
 */
export function simpleRichText(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text, version: 1 }],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}
