import type { Metadata } from 'next'
import PortfolioPageContent from '@/components/PortfolioPageContent'

export const metadata: Metadata = {
  title: 'Our Work | Slate Cinema',
  description: 'Browse Slate Cinema video production work by industry, and explore the full reel of selected campaigns.',
}

export default function PortfolioPage() {
  return <PortfolioPageContent />
}
