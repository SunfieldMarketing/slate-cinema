import posthog from "posthog-js"

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
