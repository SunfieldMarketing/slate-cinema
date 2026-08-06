/*
  Pure, client-safe helper -- deliberately split out of payload-data.ts so
  'use client' components can narrow a Payload upload relation (populated
  Media doc or bare numeric ID) to a URL string without pulling in
  payload-data.ts's module-level `getPayload()`/`@/payload.config` imports,
  which are Node-only and break the client bundle.
*/
export function mediaUrl(value: unknown): string | undefined {
  if (value && typeof value === 'object' && 'url' in value) {
    return (value as { url?: string }).url ?? undefined
  }
  return undefined
}
