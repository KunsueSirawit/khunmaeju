import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { PostCard } from '@/components/news/PostCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { Pagination } from '@/components/ui/Pagination'
import { Link } from '@/i18n/navigation'
import { getPostCategories, getPosts, parsePage } from '@/lib/data'
import { type LocaleParams, resolveLocale } from '@/lib/locale'

type Props = LocaleParams & { searchParams: Promise<{ page?: string; category?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params)
  const t = await getTranslations({ locale, namespace: 'News' })
  return { title: t('title'), description: t('intro') }
}

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await resolveLocale(params)
  const query = await searchParams
  const page = parsePage(query.page)
  const t = await getTranslations('News')

  const categories = await getPostCategories(locale)
  const active = categories.find((c) => c.slug === query.category)
  const result = await getPosts(locale, page, active?.id)

  const filters = [{ slug: undefined, name: t('all') }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))]

  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} crumbs={[{ label: t('title') }]} />
      <div className="container-page py-10 lg:py-14">
        <nav aria-label={t('filter')} className="mb-8">
          <ul className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const isActive = f.slug === active?.slug
              return (
                <li key={f.slug ?? 'all'}>
                  <Link
                    href={f.slug ? `/news?category=${f.slug}` : '/news'}
                    aria-current={isActive ? 'page' : undefined}
                    className={`block rounded-full border px-4 py-2 transition-colors ${
                      isActive
                        ? 'border-brand-700 bg-brand-700 font-semibold text-white'
                        : 'border-line bg-white hover:border-brand-500 hover:text-brand-700'
                    }`}
                  >
                    {f.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {result.docs.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.docs.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-line bg-white p-10 text-center text-muted">{t('empty')}</p>
        )}
        <Pagination page={result.page} totalPages={result.totalPages} basePath="/news" query={{ category: active?.slug }} />
      </div>
    </>
  )
}
