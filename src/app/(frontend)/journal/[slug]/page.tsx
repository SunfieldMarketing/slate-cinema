import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getNormalizedJournalPosts } from '@/lib/normalize'
import { getJournalPageGlobal } from '@/lib/payload-data'
import JournalPostContent from '@/components/JournalPostContent'
import { pageMetadata } from '@/lib/seo'
import { PLACEHOLDER_IMAGE } from '@/lib/media-url'
import { postDates } from '@/lib/journal-dates'
import { SITE_URL } from '@/lib/site-url'

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

  // BlogPosting + BreadcrumbList structured data (2026-11-07, Levi's AI-search list #7): AI
  // answers favour sources they can date and attribute. A team byline is credited to the
  // company itself; a named author (set under Author in /admin) becomes a Person.
  const url = `${SITE_URL}/journal/${post.slug}`
  const dates = postDates(post)
  const organization = { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Slate Cinema', url: SITE_URL }
  const teamByline = !post.author?.trim() || /slate cinema|team/i.test(post.author)
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        ...(post.coverImage && post.coverImage !== PLACEHOLDER_IMAGE ? { image: post.coverImage } : {}),
        datePublished: dates.published,
        dateModified: dates.modified,
        author: teamByline ? organization : { '@type': 'Person', name: post.author },
        publisher: organization,
        mainEntityOfPage: url,
        articleSection: post.category,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/journal` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <JournalPostContent post={post} allPosts={posts} page={page} />
    </>
  )
}
