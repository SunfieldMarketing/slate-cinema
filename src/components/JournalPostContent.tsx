'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import { journalPosts, type JournalPost } from '@/lib/journal'

gsap.registerPlugin(ScrollTrigger)

function ArticleBody({ post }: { post: JournalPost }) {
  return (
    <div className="jp-in">
      {post.content.map((block, i) => {
        if (block.type === 'h2') {
          return (
            <h2 key={i} className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-12 mb-5 first:mt-0">
              {block.text}
            </h2>
          )
        }
        if (block.type === 'quote') {
          return (
            <blockquote
              key={i}
              className="my-10 pl-6 border-l-2 text-lg sm:text-xl font-light text-white/80 leading-relaxed italic"
              style={{ borderColor: post.accent }}
            >
              {block.text}
            </blockquote>
          )
        }
        if (block.type === 'list') {
          return (
            <ul key={i} className="my-6 space-y-3">
              {block.items?.map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-white/65 font-light leading-relaxed">
                  <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: post.accent }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="text-white/65 font-light leading-relaxed mb-6 text-base sm:text-lg">
            {block.text}
          </p>
        )
      })}
    </div>
  )
}

export default function JournalPostContent({ post }: { post: JournalPost }) {
  const ref = useRef<HTMLElement>(null)
  const related = journalPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

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
        <section className="relative w-full pt-32 pb-10 md:pt-40 md:pb-14 overflow-hidden">
          <div className="relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <div className="jp-hero-in flex items-center justify-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-6" style={{ color: post.accent }}>
              <span className="w-8 h-px" style={{ background: `${post.accent}66` }} />
              {post.category}
              <span className="w-8 h-px" style={{ background: `${post.accent}66` }} />
            </div>
            <h1 className="jp-hero-in text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.08] mb-6">
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

        {/* Article body */}
        <section className="relative w-full max-w-2xl mx-auto px-5 sm:px-8 pb-20 md:pb-28">
          <ArticleBody post={post} />

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
                      <h3 className="text-white font-bold text-sm leading-snug mb-2 group-hover:text-[#00AEEF] transition-colors line-clamp-2">
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
