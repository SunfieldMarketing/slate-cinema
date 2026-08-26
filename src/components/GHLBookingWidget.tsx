'use client'

import Script from 'next/script'
import type { ScheduleACallPage } from '@/payload-types'

/*
  Replaces CustomCalendar.tsx's static date/time grid, per the client's
  fix request 2026-08-20: the old grid POSTed to /api/booking, which only
  ever created a GHL contact + sent a notification email -- it could not
  check real availability or create a real appointment, so nothing ever
  actually landed on a calendar. This embeds GHL's own booking widget
  instead (same setup already live on wavecare.io/contact -- verified by
  reading that page's actual DOM, not guessed): a real calendar, real
  availability, and a real appointment created directly in GHL the
  moment someone books, with zero involvement from our backend.

  Two labels from the old `calendar` global group (eyebrow/headline)
  still work fine as a section header above the widget; the rest
  (monthLabel, selectDateLabel, selectTimeLabel, confirmLabel,
  confirmedLabel) described UI that no longer exists -- the widget
  handles its own date/time selection and confirmation state internally,
  inside the iframe.

  Height is pinned, per follow-up request 2026-08-20: GHL's own
  form_embed.js watches the iframe content for postMessage height
  updates and rewrites the iframe's inline style.height on every step
  (date grid -> time list -> contact form -> confirmation), which made
  the page jump on every click. A plain CSS rule can't out-priority
  that -- it's JS setting an inline style *after* our render, so it
  wins over any normal stylesheet rule regardless of specificity. The
  one thing that still beats an inline style is `!important` in a real
  stylesheet rule, so that's what actually locks it: form_embed.js
  keeps "succeeding" (the inline value does get set), it's just visibly
  overridden. Height is a fixed value, not a min-height -- picked
  generously tall (1080px) to comfortably fit the tallest step
  (contact-details form) without clipping shorter steps, which just
  leave a little empty space instead. scrolling="no" stays off since
  there should never be a need to scroll within a box this size.
*/
const CALENDAR_ID = 'nwrti66org5yO4mGWzb3'
const WIDGET_HEIGHT_PX = 1080

export default function GHLBookingWidget({ copy }: { copy?: ScheduleACallPage['calendar'] }) {
  const eyebrow = copy?.eyebrow || '// Production Meeting'
  const headline = copy?.headline || 'Lock In A Time'
  const sessionLabel = copy?.sessionLabel || 'Strategy Session'
  const durationLabel = copy?.durationLabel || '45 Min Video Call'

  return (
    <section className="relative w-full pt-10 pb-20 md:pt-14 md:pb-24 overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6" data-cms-global="schedule-a-call-page">
        <div className="text-center mb-10">
          <span data-cms-field="calendar.eyebrow" className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase block mb-4">{eyebrow}</span>
          <h2 data-cms-field="calendar.headline" className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-3">{headline}</h2>
          <p className="text-white/40 text-sm">
            <span data-cms-field="calendar.sessionLabel">{sessionLabel}</span> · <span data-cms-field="calendar.durationLabel">{durationLabel}</span>
          </p>
        </div>

        {/* !important beats form_embed.js's inline style.height rewrites
            -- see the header comment above for why a normal rule can't. */}
        <style>{`#${CALENDAR_ID} { height: ${WIDGET_HEIGHT_PX}px !important; }`}</style>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-2 sm:p-4">
          <iframe
            src={`https://api.leadconnectorhq.com/widget/booking/${CALENDAR_ID}`}
            style={{ width: '100%', border: 'none', overflow: 'hidden' }}
            scrolling="no"
            id={CALENDAR_ID}
            title="Book a call"
          />
        </div>
      </div>

      <Script src="https://api.leadconnectorhq.com/js/form_embed.js" strategy="afterInteractive" />
    </section>
  )
}
