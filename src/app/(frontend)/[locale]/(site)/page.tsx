import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

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

type Params = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = (await params).locale as Locale
  const settings = await getSiteSettings(locale)
  return {
    title: { absolute: settings.siteName },
    description: settings.defaultMetaDescription ?? undefined,
  }
}

export default async function HomePage({ params }: Params) {
  const locale = (await params).locale as Locale
  setRequestLocale(locale)

  const home = await getHomePage(locale)
  const [products, certificates, branches, posts] = await Promise.all([
    getFeaturedProducts(locale, home.featuredProducts?.products),
    getCertificates(locale),
    getBranches(locale),
    getLatestPosts(locale, 3),
  ])

  return <HomeView home={home} products={products} certificates={certificates} branches={branches} posts={posts} />
}
