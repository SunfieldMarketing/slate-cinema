import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { simpleRichText } from '@/lib/simple-richtext'
import { forwardToGHL } from '@/lib/ghl'

/*
  Real destination for /schedule-a-call's "Confirm Time" button. It
  previously only fired a PostHog event -- no real calendar/booking
  backend exists (the date/time grid is static, see
  CMS_MIGRATION_PHASE0_INVENTORY.md). This makes the confirmed
  date/time visible in Payload's admin form-submissions view so a real
  person can actually follow up, in addition to whatever real calendar
  integration (Calendly, Cal.com, etc.) eventually replaces the static
  grid.

  CustomCalendar now also collects name/email/phone before confirming
  (previously date+time only, with no way to know who booked) -- both
  the CMS mirror and the GHL forward include them.
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

    forwardToGHL('GHL_BOOKING_WEBHOOK_URL', { name, email, phone, date, time }).catch(() => {})

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('booking CMS mirror failed:', err)
    return NextResponse.json({ ok: false, mirrored: false })
  }
}
