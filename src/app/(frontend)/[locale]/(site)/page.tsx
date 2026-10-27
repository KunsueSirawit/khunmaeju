import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { JsonLd } from '@/components/seo/JsonLd'
import { HomeView } from '@/components/sections/HomeView'
import type { Locale } from '@/i18n/locales'
import {
  getBranches,
  getCertificates,
  getFeaturedProducts,
  getHomePage,
  getLatestPosts,
  getSiteSettings,
} from '@/lib/data'
import { pageMetadata } from '@/lib/seo'
import { organizationSchema } from '@/lib/structured-data'

type Params = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = (await params).locale as Locale
  const settings = await getSiteSettings(locale)
  return pageMetadata({
    locale,
    path: '',
    title: { absolute: settings.tagline ? `${settings.siteName} | ${settings.tagline}` : settings.siteName },
    description: settings.defaultMetaDescription,
  })
}

export default async function HomePage({ params }: Params) {
  const locale = (await params).locale as Locale
  setRequestLocale(locale)

  const home = await getHomePage(locale)
  const [settings, products, certificates, branches, posts] = await Promise.all([
    getSiteSettings(locale),
    getFeaturedProducts(locale, home.featuredProducts?.products),
    getCertificates(locale),
    getBranches(locale),
    getLatestPosts(locale, 3),
  ])

  return (
    <>
      <JsonLd data={organizationSchema(settings, locale, branches)} />
      <HomeView home={home} products={products} certificates={certificates} branches={branches} posts={posts} />
    </>
  )
}
