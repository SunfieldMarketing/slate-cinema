import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getNormalizedJournalPosts } from '@/lib/normalize'
import { getJournalPageGlobal } from '@/lib/payload-data'
import JournalPostContent from '@/components/JournalPostContent'
import { pageMetadata } from '@/lib/seo'
import { PLACEHOLDER_IMAGE } from '@/lib/media-url'

export async function generateStaticParams() {
  const posts = await getNormalizedJournalPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const posts = await getNormalizedJournalPosts()
  const post = posts.find((p) => p.slug === slug)
  if (!post) return {}
  // The post's "Search engines & sharing" fields, else its title and
  // excerpt, shared with its cover image.
  return pageMetadata({
    path: `/journal/${post.slug}`,
    seo: post.seo,
    // Just the post title: the site-wide template adds " | Slate Cinema". It also
    // used to add " | The Slate Journal", which pushed long titles to 70-111
    // characters and got them cut off in search results (Oct 27 audit #31).
    title: post.title,
    description: post.excerpt,
    image: post.coverImage !== PLACEHOLDER_IMAGE ? post.coverImage : undefined,
  })
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const draft = (await draftMode()).isEnabled
  const [posts, page] = await Promise.all([getNormalizedJournalPosts(draft), getJournalPageGlobal(draft)])
  const post = posts.find((p) => p.slug === slug)
  if (!post) notFound()
  return <JournalPostContent post={post} allPosts={posts} page={page} />
}
