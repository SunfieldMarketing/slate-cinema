import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { simpleRichText } from '@/lib/simple-richtext'

/*
  Real CMS destination for the Project Intake form (public/intake.html,
  embedded via iframe on /contact/project). That file already POSTs
  straight to a GHL webhook on submit (see WEBHOOK_URL in its bundled
  js_3_big.js resource) -- this route does not touch that delivery at
  all. It exists purely so a submission also lands in Payload's
  form-submissions, visible at /admin, the same way Lead Form/Booking/
  Newsletter do. IntakeFrame.tsx (client component wrapping the iframe
  on /contact/project) intercepts the iframe's outgoing fetch to the GHL
  webhook and mirrors the same payload here in parallel -- it never
  blocks or alters the original GHL request.
*/
const FORM_TITLE = 'Project Intake'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'a JSON payload is required' }, { status: 400 })
  }
  // The intake app's buildPayload() shape -- see js_3_big.js. Every field
  // is optional here since this is a best-effort mirror, not the primary
  // save path (GHL is).
  const fields = [
    'full_name', 'first_name', 'last_name', 'email', 'phone', 'company',
    'project_types', 'pre_production', 'production', 'post_production',
    'distribution', 'deliverables', 'goals', 'timeline', 'budget', 'notes',
    'references', 'submitted_at', 'source',
  ] as const

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
                fields: fields.map((name) => ({
                  blockType: 'text',
                  name,
                  label: name,
                  required: false,
                })),
                submitButtonLabel: 'Submit',
                confirmationType: 'message',
                confirmationMessage: simpleRichText('Thanks — got your project brief.'),
              },
            })
          ).id

    await payload.create({
      collection: 'form-submissions',
      data: {
        form: formId,
        submissionData: fields
          .filter((f) => body[f] != null)
          .map((f) => ({ field: f, value: String(body[f]) })),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('intake CMS mirror failed:', err)
    return NextResponse.json({ ok: false, mirrored: false })
  }
}
