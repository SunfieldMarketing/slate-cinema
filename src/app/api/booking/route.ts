import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { simpleRichText } from '@/lib/simple-richtext'
import { forwardToGHL, splitName } from '@/lib/ghl'

/*
  ORPHANED as of 2026-08-20 -- nothing on the frontend calls this
  anymore. /schedule-a-call now embeds GHL's own booking widget
  (GHLBookingWidget.tsx) directly, per the client's fix request: this
  route's webhook forward only ever created a GHL contact + sent a
  notification email, it could never check real availability or create
  a real appointment, so no booking made through it ever actually
  landed on a calendar. GHL's widget talks straight to GHL, with no
  involvement from this backend at all.

  Kept (not deleted) purely as the historical record of every booking
  attempt made through the old static date/time grid -- see the
  `form-submissions` collection where `form` refers to the "Schedule a
  Call" form (title lookup, not a fixed ID). Only 2 rows exist there as
  of this writing, both internal test submissions from 2026-08-17
  ("Test Cal Check" / "Test Calendar Check", webhook-test-cal+... email
  addresses) -- no real customer bookings found. This mirror-to-Payload
  behavior only existed from 2026-08-12 onward (before that: PostHog
  event only, no captured name/email/date/time at all), which is
  approximately when the new site went live on the real domain, so
  coverage is very likely complete.
*/
const FORM_TITLE = 'Schedule a Call'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (
    !body ||
    typeof body.date !== 'string' ||
    typeof body.time !== 'string' ||
    typeof body.name !== 'string' ||
    typeof body.email !== 'string' ||
    typeof body.phone !== 'string'
  ) {
    return NextResponse.json({ error: 'date, time, name, email, and phone are required' }, { status: 400 })
  }
  const { date, time, name, email, phone } = body as {
    date: string
    time: string
    name: string
    email: string
    phone: string
  }

  try {
    const payload = await getPayload({ config })

    const existingForm = await payload.find({
      collection: 'forms',
      where: { title: { equals: FORM_TITLE } },
      limit: 1,
    })
    const formId =
      existingForm.totalDocs > 0
        ? existingForm.docs[0]!.id
        : (
            await payload.create({
              collection: 'forms',
              data: {
                title: FORM_TITLE,
                fields: [
                  { blockType: 'text', name: 'name', label: 'Name', required: true },
                  { blockType: 'email', name: 'email', label: 'Email', required: true },
                  { blockType: 'text', name: 'phone', label: 'Phone', required: true },
                  { blockType: 'text', name: 'date', label: 'Date', required: true },
                  { blockType: 'text', name: 'time', label: 'Time', required: true },
                ],
                submitButtonLabel: 'Confirm Time',
                confirmationType: 'message',
                confirmationMessage: simpleRichText("Thanks — your requested time is booked in."),
              },
            })
          ).id

    await payload.create({
      collection: 'form-submissions',
      data: {
        form: formId,
        submissionData: [
          { field: 'name', value: name },
          { field: 'email', value: email },
          { field: 'phone', value: phone },
          { field: 'date', value: date },
          { field: 'time', value: time },
        ],
      },
    })

    const { firstName, lastName } = splitName(name)
    forwardToGHL('GHL_BOOKING_WEBHOOK_URL', {
      name,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      date,
      time,
    }).catch(() => {})

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('booking CMS mirror failed:', err)
    return NextResponse.json({ ok: false, mirrored: false })
  }
}
