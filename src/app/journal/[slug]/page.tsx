import { notFound } from 'next/navigation'
import { journalPosts, getJournalPostBySlug } from '@/lib/journal'
import JournalPostContent from '@/components/JournalPostContent'

export function generateStaticParams() {
  return journalPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getJournalPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | The Slate Journal`,
    description: post.excerpt,
  }
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getJournalPostBySlug(slug)
  if (!post) notFound()
  return <JournalPostContent post={post} />
}
