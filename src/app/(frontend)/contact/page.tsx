import type { Metadata } from 'next'
import ContactPageContent from '@/components/ContactPageContent'

export const metadata: Metadata = {
  title: 'Get Started | Slate Cinema',
  description:
    'Tell us where you’re at — leave a quick lead, fill out a full project intake, or schedule a call. We reply within one business day.',
}

export default function ContactPage() {
  return <ContactPageContent />
}
