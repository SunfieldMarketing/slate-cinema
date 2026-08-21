/**
 * Forwards a submission to a Go High Level webhook, if one is configured.
 * No-ops (returns { sent: false, reason: 'not configured' }) when the env
 * var is unset, so this is always safe to call -- the moment a real
 * webhook URL is added to Vercel's env vars, delivery turns on with no
 * further code changes.
 *
 * Mirrors intake.html's own already-working GHL delivery (see
 * IntakeFrame.tsx): form-encoded body, no-cors-friendly on the client
 * side, but here we're server-side so we can actually read the response
 * status and log real failures instead of firing blind.
 */
/**
 * Splits a single "Full Name" field into { firstName, lastName }.
 *
 * Added 2026-08-17 per Levi's real-world finding: the lead form sent one
 * combined `name` field, but the GHL workflow expected `first_name` /
 * `last_name` -- those didn't exist, so every lead landed with a blank
 * name. He fixed it that time by remapping the CRM workflow to read
 * `name` directly, but flagged that the calendar booking form would hit
 * the identical issue the moment it got wired up (same combined-name
 * pattern). Rather than rely on a CRM-side remap per form -- which only
 * fixes the one workflow it's applied to, and has to be redone for every
 * new form that gets added later -- every GHL forward now sends both
 * shapes: `name` (already working, keeps Levi's existing remap intact)
 * and `first_name` / `last_name` (matching what a GHL workflow expects
 * out of the box, so nothing needs remapping going forward).
 */
export function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  }
}

export async function forwardToGHL(envVar: string, data: Record<string, unknown>) {
  const url = process.env[envVar]
  if (!url) {
    console.info(`GHL forward (${envVar}) skipped -- env var not set`)
    return { sent: false, reason: 'not configured' as const }
  }

  try {
    const form = new URLSearchParams()
    Object.entries(data).forEach(([k, v]) => form.append(k, v == null ? '' : String(v)))

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: form.toString(),
    })
    // Added 2026-08-20 -- this used to only log on failure, which made a
    // real bug report ("nothing reached GHL") undiagnosable: a silent
    // codepath and a silent success look identical in the logs. Logging
    // the body on success too matters specifically because some webhook
    // receivers return 200 for "request received" regardless of whether
    // the workflow behind it is active/valid -- a 200 here doesn't
    // guarantee GHL actually did anything with it, so the response body
    // is the only place that distinction could show up.
    const bodyText = await res.text().catch(() => '<unreadable body>')
    if (!res.ok) {
      console.error(`GHL forward (${envVar}) responded ${res.status}: ${bodyText}`)
    } else {
      console.info(`GHL forward (${envVar}) succeeded ${res.status}: ${bodyText}`)
    }
    return { sent: res.ok, status: res.status }
  } catch (err) {
    console.error(`GHL forward (${envVar}) failed:`, err)
    return { sent: false, error: String(err) }
  }
}
