import type { Metadata } from 'next'
import JournalPageContent from '@/components/JournalPageContent'

export const metadata: Metadata = {
  title: 'The Slate Journal | Slate Cinema',
  description:
    'Notes on video production, storytelling, and brand — practical writing from Slate Cinema on what actually earns attention and what makes people watch to the end.',
}

export default function JournalPage() {
  return <JournalPageContent />
}
