import posthog from "posthog-js"

// TEMPORARY DEBUG INSTRUMENTATION -- 2026-08-25, remove once the blank
// /admin bug is root-caused. Guarding posthog.init() on the token being
// present didn't fix it, so capturing whatever's actually failing
// directly: this runs before anything else client-side (confirmed
// instrumentation-client.ts fires ahead of PostHog init on every route),
// installs global error/rejection listeners, and writes what it catches
// to both sessionStorage (survives the page, readable via devtools/any
// script) and document.title (visible at a glance, no devtools needed)
// so a real crash during hydration -- which has produced zero console/
// network/server-log signal so far -- becomes visible somewhere.
if (typeof window !== "undefined") {
  const report = (label: string, detail: string) => {
    try {
      const line = `[${new Date().toISOString()}] ${label}: ${detail}`
      const prior = sessionStorage.getItem("__debug_errors__") || ""
      sessionStorage.setItem("__debug_errors__", prior + line + "\n")
      document.title = `ERR(${sessionStorage.getItem("__debug_errors__")!.split("\n").length - 1}): ${detail.slice(0, 60)}`
    } catch {
      // sessionStorage can throw in some contexts (private mode, quota) --
      // fall back to title-only so at least one channel still works.
      document.title = `ERR: ${detail.slice(0, 60)}`
    }
  }
  window.addEventListener("error", (e) => {
    report("error", `${e.message} @ ${e.filename}:${e.lineno}:${e.colno}\n${e.error?.stack ?? ""}`)
  })
  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason
    const detail = reason instanceof Error ? `${reason.message}\n${reason.stack ?? ""}` : String(reason)
    report("unhandledrejection", detail)
  })
}

// Found 2026-08-25 while debugging a blank /admin page: this ran
// unconditionally, so with NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN unset in
// production (confirmed via checkEnvVars all session) it called
// posthog.init(undefined, { capture_exceptions: true, ... }) on every
// single route load, including /admin. PostHog's exception autocapture
// installs global window.onerror / unhandledrejection listeners as part
// of init -- with no valid token to actually report to, the net effect
// was a real client-side error being intercepted by a broken listener
// instead of ever reaching the console or an error boundary, which is
// consistent with /admin rendering a totally empty page with zero
// visible errors anywhere. Guarding the whole call on the token being
// present stops PostHog from patching anything when it can't actually
// report, in addition to being the correct fix for the token warning
// itself.
if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  })
}
