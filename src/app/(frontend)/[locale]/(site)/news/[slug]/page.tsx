import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { PostCard } from '@/components/news/PostCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link } from '@/i18n/navigation'
import { getLatestPosts, getPost, getSiteSettings } from '@/lib/data'
import { formatDate } from '@/lib/format'
import { type LocaleParams, resolveLocale } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'
import { articleSchema } from '@/lib/structured-data'

type Props = LocaleParams<{ slug: string }>

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await resolveLocale(params)
  const post = await getPost(locale, slug)
  if (!post) return {}
  return pageMetadata({
    locale,
    path: `/news/${slug}`,
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt,
    image: post.meta?.image || post.cover,
    type: 'article',
    publishedTime: post.publishedAt,
  })
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await resolveLocale(params)
  const post = await getPost(locale, slug)
  if (!post) notFound()

  const [settings, latest, t, nav] = await Promise.all([
    getSiteSettings(locale),
    getLatestPosts(locale, 4),
    getTranslations('News'),
    getTranslations('Nav'),
  ])
  const more = latest.filter((p) => p.id !== post.id).slice(0, 3)
  const category = post.category && typeof post.category === 'object' ? post.category : null

  return (
    <>
      <JsonLd data={articleSchema(post, settings, locale)} />
      <article>
        <header className="container-page max-w-4xl pt-8 pb-6 sm:pt-12">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
              <li>
                <Link href="/" className="hover:text-brand-700">{nav('home')}</Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/news" className="hover:text-brand-700">{nav('news')}</Link>
              </li>
            </ol>
          </nav>
          <p className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted">
            {category && (
              <Link
                href={`/news?category=${category.slug}`}
                className="rounded-full bg-accent-100 px-3 py-1 font-medium text-accent-600 hover:bg-accent-400 hover:text-brand-900"
              >
                {category.name}
              </Link>
            )}
            {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>}
          </p>
          <h1 className="mt-3 text-3xl font-bold text-brand-800 sm:text-4xl lg:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-xl text-muted">{post.excerpt}</p>}
        </header>

        {post.cover && (
          <div className="container-page max-w-5xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-sand">
              <MediaImage media={post.cover} size="wide" fill priority sizes="(min-width: 1024px) 64rem, 100vw" className="object-cover" />
            </div>
          </div>
        )}

        <div className="container-page max-w-3xl py-10 sm:py-14">
          <RichText data={post.content} locale={locale} className="prose-lg" />
          <div className="mt-12 border-t border-line pt-6">
            <Button href="/news" variant="outline">
              <Icon name="arrowRight" className="size-5 rotate-180" />
              {t('back')}
            </Button>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section aria-labelledby="more-news" className="section bg-white">
          <div className="container-page">
            <SectionHeading id="more-news" heading={t('more')} />
            <ul className="grid gap-6 md:grid-cols-3">
              {more.map((p) => (
                <li key={p.id}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
