import type { Metadata } from 'next'
import ContactPageContent from '@/components/ContactPageContent'
import { getContactPageGlobal, getReadyToTalk } from '@/lib/payload-data'

export const metadata: Metadata = {
  title: 'Get Started | Slate Cinema',
  description:
    'Tell us where you’re at — leave a quick lead, fill out a full project intake, or schedule a call. We reply within one business day.',
}

export default async function ContactPage() {
  const [page, readyToTalk] = await Promise.all([getContactPageGlobal(), getReadyToTalk()])
  return <ContactPageContent page={page} readyToTalk={readyToTalk} />
}
