'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import type { JournalPostLocal } from '@/lib/normalize'

gsap.registerPlugin(ScrollTrigger)

export default function JournalPostContent({ post, allPosts }: { post: JournalPostLocal; allPosts: JournalPostLocal[] }) {
  const ref = useRef<HTMLElement>(null)
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.jp-hero-in', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' })
      gsap.fromTo('.jp-in', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 })
      gsap.fromTo('.jp-related', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.jp-related-grid', start: 'top 85%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <main ref={ref} className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-[#00AEEF] selection:text-white">
      <AmbientBackdrop accent={post.accent} />

      <div className="relative z-10 w-full">
        <Nav />

        {/* Article hero */}
        <section className="relative w-full pt-32 pb-10 md:pt-40 md:pb-14 overflow-hidden" data-cms-collection="journal-posts" data-cms-doc-id={post.id}>
          <div className="relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <div className="jp-hero-in flex items-center justify-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-6" style={{ color: post.accent }} data-cms-field="category">
              <span className="w-8 h-px" style={{ background: `${post.accent}66` }} />
              {post.category}
              <span className="w-8 h-px" style={{ background: `${post.accent}66` }} />
            </div>
            <h1 data-cms-field="title" className="jp-hero-in text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.08] mb-6">
              {post.title}
            </h1>
            <div className="jp-hero-in flex items-center justify-center gap-3 font-mono text-[11px] text-white/45 uppercase tracking-wide">
              <span>{post.author}</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </section>

        {/* Cover image */}
        <section className="relative w-full max-w-5xl mx-auto px-5 sm:px-8 mb-14 md:mb-20">
          <div className="jp-hero-in relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/10">
            <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          </div>
        </section>

        {/* Article body — rendered from Payload's Lexical rich-text field.
            Styled via arbitrary-child selectors instead of custom JSX
            converters, keyed to the post's own accent color for the
            blockquote/list markers via a CSS variable. */}
        <section className="relative w-full max-w-2xl mx-auto px-5 sm:px-8 pb-20 md:pb-28" data-cms-collection="journal-posts" data-cms-doc-id={post.id}>
          <div
            data-cms-field="content"
            className="jp-in [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-white [&_h2]:mt-12 [&_h2]:mb-5 [&_h2:first-child]:mt-0
                       [&_p]:text-white/65 [&_p]:font-light [&_p]:leading-relaxed [&_p]:mb-6 [&_p]:text-base [&_p]:sm:text-lg
                       [&_blockquote]:my-10 [&_blockquote]:pl-6 [&_blockquote]:border-l-2 [&_blockquote]:text-lg [&_blockquote]:sm:text-xl [&_blockquote]:font-light [&_blockquote]:text-white/80 [&_blockquote]:leading-relaxed [&_blockquote]:italic [&_blockquote]:[border-color:var(--post-accent)]
                       [&_ul]:my-6 [&_ul]:space-y-3 [&_ul]:list-none [&_ul]:pl-0
                       [&_li]:text-white/65 [&_li]:font-light [&_li]:leading-relaxed [&_li]:pl-5 [&_li]:relative
                       [&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.6em] [&_li]:before:w-1.5 [&_li]:before:h-1.5 [&_li]:before:rounded-full [&_li]:before:[background:var(--post-accent)]"
            style={{ ['--post-accent' as string]: post.accent }}
          >
            <RichText data={post.content} />
          </div>

          <div className="mt-16 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <div className="text-white font-bold text-lg mb-1">Have a project in mind?</div>
              <p className="text-white/50 text-sm font-light">Tell us where you&apos;re at and we&apos;ll point you to the right next step.</p>
            </div>
            <a
              href="/contact"
              className="group inline-flex items-center gap-2.5 shrink-0 px-7 py-3.5 rounded-full text-sm font-semibold text-black transition-transform hover:scale-[1.04]"
              style={{ background: post.accent }}
            >
              Get Started <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </section>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="relative w-full overflow-hidden py-16 md:py-20 border-t border-white/[0.07]">
            <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-white/40 uppercase block mb-8">
                More from the Journal
              </span>
              <div className="jp-related-grid grid grid-cols-1 sm:grid-cols-3 gap-6">
                {related.map((p) => (
                  <a
                    key={p.slug}
                    href={`/journal/${p.slug}`}
                    data-cms-collection="journal-posts"
                    data-cms-doc-id={p.id}
                    className="jp-related group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-white/25 transition-colors duration-500"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                    </div>
                    <div className="p-5">
                      <h3 data-cms-field="title" className="text-white font-bold text-sm leading-snug mb-2 group-hover:text-[#00AEEF] transition-colors line-clamp-2">
                        {p.title}
                      </h3>
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 group-hover:text-white transition-colors">
                        Read more <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </main>
  )
}
