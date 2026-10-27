import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound, permanentRedirect } from 'next/navigation'

import { ProductListing } from '@/components/product/ProductListing'
import { PageHeader } from '@/components/ui/PageHeader'
import { getProductCategories, getProductCategory, getProducts, parsePage } from '@/lib/data'
import { type LocaleParams, resolveLocale } from '@/lib/locale'
import { pageMetadata, pagedPath } from '@/lib/seo'

type Props = LocaleParams<{ slug: string }> & { searchParams: Promise<{ page?: string; from?: string }> }

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale, slug } = await resolveLocale(params)
  const category = await getProductCategory(locale, slug)
  if (!category) return {}
  const path = pagedPath(`/products/category/${slug}`, parsePage((await searchParams).page))
  return pageMetadata({ locale, path, title: category.name, description: category.description, image: category.image })
}

export default async function ProductCategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await resolveLocale(params)
  const category = await getProductCategory(locale, slug)
  const query = await searchParams
  if (!category) {
    // Old-site category link (see legacy-redirects.ts) with no matching slug here.
    if (query.from === 'legacy') permanentRedirect(`/${locale}/products`)
    notFound()
  }

  const page = parsePage(query.page)
  const t = await getTranslations('Products')
  const [result, categories] = await Promise.all([getProducts(locale, page, category.id), getProductCategories(locale)])

  return (
    <>
      <PageHeader
        title={category.name}
        intro={category.description}
        crumbs={[{ label: t('title'), href: '/products' }, { label: category.name }]}
      />
      <ProductListing
        result={result}
        categories={categories}
        activeSlug={category.slug}
        basePath={`/products/category/${category.slug}`}
      />
    </>
  )
}
