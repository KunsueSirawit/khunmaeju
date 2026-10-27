import { getLocale } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { formatDate } from '@/lib/format'
import type { Post } from '@/payload-types'

import { MediaImage } from '../ui/MediaImage'

export type PostCardData = Pick<Post, 'id' | 'title' | 'slug' | 'excerpt' | 'cover' | 'publishedAt' | 'category'>

export async function PostCard({ post }: { post: PostCardData }) {
  const locale = await getLocale()
  const category = post.category && typeof post.category === 'object' ? post.category : null

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-sand">
        <MediaImage
          media={post.cover}
          size="card"
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-2 text-sm text-muted">
          {category && (
            <span className="rounded-full bg-accent-100 px-2.5 py-0.5 font-medium text-accent-600">
              {category.name}
            </span>
          )}
          {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>}
        </p>
        <h3 className="mt-3 line-clamp-2 font-heading text-xl font-semibold text-ink group-hover:text-brand-700">
          <Link href={`/news/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-muted">{post.excerpt}</p>}
      </div>
    </article>
  )
}
