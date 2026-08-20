import type { GlobalConfig } from 'payload'

/*
  Hero + CustomCalendar copy for /schedule-a-call. The "Book a time on
  our calendar" framing block itself is the shared ReadyToTalk global
  (see src/globals/ReadyToTalk.ts) -- same content as the Contact page's
  teaser, by design.
*/
export const ScheduleACallPage: GlobalConfig = {
  slug: 'schedule-a-call-page',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Schedule a Call' },
        { name: 'titleLine1', type: 'text', defaultValue: "Let's talk" },
        { name: 'titleLine2', type: 'text', defaultValue: 'it through' },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue:
            "Grab a time that works for you. We'll walk through your project, timeline, and budget — and outline exactly what happens next.",
        },
      ],
    },
    {
      name: 'calendar',
      type: 'group',
      admin: {
        description:
          'Section header shown above the GHL booking widget on /schedule-a-call. Only eyebrow/sessionLabel/durationLabel/headline are used since 2026-08-20 -- the widget itself (real availability, real appointments) replaced the old static date/time grid, so the rest of these fields describe UI that no longer exists. Left in place rather than removed since deleting fields needs a real migration; just harmless unused data now.',
      },
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: '// Production Meeting' },
        { name: 'headline', type: 'text', defaultValue: 'Lock In A Time' },
        { name: 'sessionLabel', type: 'text', defaultValue: 'Strategy Session' },
        { name: 'durationLabel', type: 'text', defaultValue: '45 Min Video Call' },
        { name: 'monthLabel', type: 'text', defaultValue: 'OCTOBER 2026' },
        { name: 'selectDateLabel', type: 'text', defaultValue: 'Select Date' },
        { name: 'selectTimeLabel', type: 'text', defaultValue: 'Select Time' },
        { name: 'confirmLabel', type: 'text', defaultValue: 'Confirm Time' },
        { name: 'confirmedLabel', type: 'text', defaultValue: "You're Booked — We'll Be in Touch" },
      ],
    },
  ],
}
