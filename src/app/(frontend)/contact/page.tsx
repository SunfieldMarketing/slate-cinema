import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import ContactPageContent from '@/components/ContactPageContent'
import { getContactPageGlobal, getReadyToTalk } from '@/lib/payload-data'

export const metadata: Metadata = {
  title: 'Get Started',
  description:
    'Tell us where you’re at — leave a quick lead, fill out a full project intake, or schedule a call. We reply within minutes.',
}

export default async function ContactPage() {
  const draft = (await draftMode()).isEnabled
  const [page, readyToTalk] = await Promise.all([getContactPageGlobal(draft), getReadyToTalk(draft)])
  return <ContactPageContent page={page} readyToTalk={readyToTalk} />
}
