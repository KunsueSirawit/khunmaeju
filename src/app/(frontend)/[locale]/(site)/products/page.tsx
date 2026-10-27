import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { ProductListing } from '@/components/product/ProductListing'
import { PageHeader } from '@/components/ui/PageHeader'
import { getProductCategories, getProducts, parsePage } from '@/lib/data'
import { type LocaleParams, resolveLocale } from '@/lib/locale'
import { pageMetadata, pagedPath } from '@/lib/seo'

type Props = LocaleParams & { searchParams: Promise<{ page?: string }> }

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params)
  const t = await getTranslations({ locale, namespace: 'Products' })
  const path = pagedPath('/products', parsePage((await searchParams).page))
  return pageMetadata({ locale, path, title: t('title'), description: t('intro') })
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await resolveLocale(params)
  const page = parsePage((await searchParams).page)
  const t = await getTranslations('Products')
  const [result, categories] = await Promise.all([getProducts(locale, page), getProductCategories(locale)])

  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} crumbs={[{ label: t('title') }]} />
      <ProductListing result={result} categories={categories} basePath="/products" />
    </>
  )
}
