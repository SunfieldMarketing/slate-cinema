import { notFound } from 'next/navigation'
import { getNormalizedJournalPosts } from '@/lib/normalize'
import JournalPostContent from '@/components/JournalPostContent'

export async function generateStaticParams() {
  const posts = await getNormalizedJournalPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const posts = await getNormalizedJournalPosts()
  const post = posts.find((p) => p.slug === slug)
  if (!post) return {}
  return {
    title: `${post.title} | The Slate Journal`,
    description: post.excerpt,
  }
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const posts = await getNormalizedJournalPosts()
  const post = posts.find((p) => p.slug === slug)
  if (!post) notFound()
  return <JournalPostContent post={post} allPosts={posts} />
}
