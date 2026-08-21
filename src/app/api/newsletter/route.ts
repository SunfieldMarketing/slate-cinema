import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { simpleRichText } from '@/lib/simple-richtext'

/*
  Real destination for the footer newsletter signup -- previously
  PostHog-only, see CMS_MIGRATION_PHASE0_INVENTORY.md.
*/
const FORM_TITLE = 'Newsletter Signup'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body.email !== 'string' || !body.email.includes('@')) {
    return NextResponse.json({ error: 'a valid email is required' }, { status: 400 })
  }
  const { email } = body as { email: string }

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
                fields: [{ blockType: 'email', name: 'email', label: 'Email', required: true }],
                submitButtonLabel: 'Sign Up',
                confirmationType: 'message',
                confirmationMessage: simpleRichText("You're on the list."),
              },
            })
          ).id

    await payload.create({
      collection: 'form-submissions',
      data: {
        form: formId,
        submissionData: [{ field: 'email', value: email }],
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('newsletter CMS mirror failed:', err)
    return NextResponse.json({ ok: false, mirrored: false })
  }
}
