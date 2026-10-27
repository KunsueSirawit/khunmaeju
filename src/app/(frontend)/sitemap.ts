import type { MetadataRoute } from 'next'

import { defaultLocale } from '@/i18n/locales'
import { getSitemapDocs } from '@/lib/data'
import { absoluteURL, languageAlternates } from '@/lib/seo'

// Built per request so new products and posts appear without a redeploy.
export const dynamic = 'force-dynamic'

const STATIC_PATHS = ['', '/products', '/news', '/about', '/services', '/how-to-order', '/contact']

/** One entry per page (default-locale URL) with hreflang links to every language. */
const entry = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] => ({
  url: absoluteURL(`/${defaultLocale}${path}`),
  lastModified,
  alternates: {
    languages: Object.fromEntries(
      Object.entries(languageAlternates(path)).map(([lang, href]) => [lang, absoluteURL(href)]),
    ),
  },
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, categories, posts } = await getSitemapDocs()
  return [
    ...STATIC_PATHS.map((path) => entry(path)),
    ...categories.map((c) => entry(`/products/category/${c.slug}`, c.updatedAt)),
    ...products.map((p) => entry(`/products/${p.slug}`, p.updatedAt)),
    ...posts.map((p) => entry(`/news/${p.slug}`, p.updatedAt)),
  ]
}
