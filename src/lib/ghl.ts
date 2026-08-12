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
export async function forwardToGHL(envVar: string, data: Record<string, unknown>) {
  const url = process.env[envVar]
  if (!url) return { sent: false, reason: 'not configured' as const }

  try {
    const form = new URLSearchParams()
    Object.entries(data).forEach(([k, v]) => form.append(k, v == null ? '' : String(v)))

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: form.toString(),
    })
    if (!res.ok) {
      console.error(`GHL forward (${envVar}) responded ${res.status}`)
    }
    return { sent: res.ok, status: res.status }
  } catch (err) {
    console.error(`GHL forward (${envVar}) failed:`, err)
    return { sent: false, error: String(err) }
  }
}
