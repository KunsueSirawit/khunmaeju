import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { ProductListing } from '@/components/product/ProductListing'
import { PageHeader } from '@/components/ui/PageHeader'
import { getProductCategories, getProductCategory, getProducts, parsePage } from '@/lib/data'
import { type LocaleParams, resolveLocale } from '@/lib/locale'

type Props = LocaleParams<{ slug: string }> & { searchParams: Promise<{ page?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await resolveLocale(params)
  const category = await getProductCategory(locale, slug)
  if (!category) return {}
  return { title: category.name, description: category.description ?? undefined }
}

export default async function ProductCategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await resolveLocale(params)
  const category = await getProductCategory(locale, slug)
  if (!category) notFound()

  const page = parsePage((await searchParams).page)
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
