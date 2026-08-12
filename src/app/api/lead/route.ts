import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { simpleRichText } from '@/lib/simple-richtext'
import { forwardToGHL } from '@/lib/ghl'

/*
  Real destination for the Contact page's "Drop us a line" lead form,
  wired per Phase 3 of the migration playbook. Previously this form only
  fired a PostHog event and showed a success message -- nothing was
  actually captured anywhere (see CMS_MIGRATION_PHASE0_INVENTORY.md).
  Submissions land in Payload's form-submissions collection, visible at
  /admin, and also forward to GHL_LEAD_WEBHOOK_URL the moment that env
  var is set (no-ops until then -- see src/lib/ghl.ts).
*/
const FORM_TITLE = 'Lead Form (Drop us a line)'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body.name !== 'string' || typeof body.email !== 'string' || typeof body.phone !== 'string') {
    return NextResponse.json({ error: 'name, email, and phone are required' }, { status: 400 })
  }
  const { name, email, phone, company, message } = body as {
    name: string
    email: string
    phone: string
    company?: string
    message?: string
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
                  { blockType: 'text', name: 'company', label: 'Company', required: false },
                  { blockType: 'text', name: 'message', label: 'Message', required: false },
                ],
                submitButtonLabel: 'Send Message',
                confirmationType: 'message',
                confirmationMessage: simpleRichText("Thanks — we'll be in touch shortly."),
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
          { field: 'company', value: company ?? '' },
          { field: 'message', value: message ?? '' },
        ],
      },
    })

    // Best-effort, never blocks the response above from having already
    // succeeded -- a GHL hiccup (or it simply not being configured yet)
    // must never turn into a broken-looking form for the visitor.
    forwardToGHL('GHL_LEAD_WEBHOOK_URL', { name, email, phone, company: company ?? '', message: message ?? '' }).catch(() => {})

    return NextResponse.json({ ok: true })
  } catch (err) {
    // Never let a CMS-mirroring failure surface as a broken form to the
    // visitor -- log it, return 200-shaped-but-flagged so the caller can
    // still show its existing success state.
    console.error('lead form CMS mirror failed:', err)
    return NextResponse.json({ ok: false, mirrored: false })
  }
}
