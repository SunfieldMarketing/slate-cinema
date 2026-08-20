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
*/
const CALENDAR_ID = 'nwrti66org5yO4mGWzb3'

export default function GHLBookingWidget({ copy }: { copy?: ScheduleACallPage['calendar'] }) {
  const eyebrow = copy?.eyebrow || '// Production Meeting'
  const headline = copy?.headline || 'Lock In A Time'
  const sessionLabel = copy?.sessionLabel || 'Strategy Session'
  const durationLabel = copy?.durationLabel || '45 Min Video Call'

  return (
    <section className="relative w-full pt-10 pb-20 md:pt-14 md:pb-24 overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6">
        <div className="text-center mb-10">
          <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase block mb-4">{eyebrow}</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-3">{headline}</h2>
          <p className="text-white/40 text-sm">
            {sessionLabel} · {durationLabel}
          </p>
        </div>

        {/* GHL's widget manages its own height via form_embed.js
            (postMessage-driven resize) -- the inline height here is
            just a sane starting point before that first resize fires. */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-2 sm:p-4">
          <iframe
            src={`https://api.leadconnectorhq.com/widget/booking/${CALENDAR_ID}`}
            style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight: 900 }}
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
