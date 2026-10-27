import type { Metadata } from 'next'

import { asMedia, toSrc } from '@/components/ui/MediaImage'
import { defaultLocale, type Locale, locales } from '@/i18n/locales'
import type { Media } from '@/payload-types'

import { getSiteSettings } from './data'
import { serverURL } from './preview'

const ogLocale: Record<Locale, string> = { th: 'th_TH', en: 'en_US' }

/** hreflang links for a path without the locale prefix ('' for home, '/products', ...). */
export const languageAlternates = (path: string) => ({
  ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
  'x-default': `/${defaultLocale}${path}`,
})

/** Path plus the query params that change a listing's content, e.g. /products?page=2. */
export const pagedPath = (path: string, page: number, params: Record<string, string> = {}): string => {
  const query = new URLSearchParams(params)
  if (page > 1) query.set('page', String(page))
  const qs = query.toString()
  return qs ? `${path}?${qs}` : path
}

/** Absolute URL for JSON-LD and anything else outside Next's metadata (which uses metadataBase). */
export const absoluteURL = (pathOrURL: string): string =>
  pathOrURL.startsWith('http') ? pathOrURL : `${serverURL()}${pathOrURL}`

/** Best image URL for sharing: the wide size if there is one, else the original. */
export const shareImage = (value: Media['id'] | Media | null | undefined) => {
  const media = asMedia(value)
  const url = media?.sizes?.wide?.url || media?.url
  if (!media || !url) return null
  const wide = media.sizes?.wide?.url ? media.sizes.wide : null
  return {
    url: toSrc(url),
    width: wide?.width || media.width || undefined,
    height: wide?.height || media.height || undefined,
    alt: media.alt || '',
  }
}

type PageMetadata = {
  locale: Locale
  /** Path without the locale prefix, including any query that changes the content (e.g. ?page=2). */
  path: string
  title: string | { absolute: string }
  description?: string | null
  image?: Media['id'] | Media | null
  type?: 'website' | 'article'
  publishedTime?: string | null
}

/**
 * Title/description plus canonical, hreflang, Open Graph and Twitter tags for a page.
 * Falls back to the site-wide description and share image from Site Settings.
 */
export async function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
  type = 'website',
  publishedTime,
}: PageMetadata): Promise<Metadata> {
  const settings = await getSiteSettings(locale)
  const desc = description || settings.defaultMetaDescription || undefined
  const og = shareImage(image) ?? shareImage(settings.defaultOgImage)
  const fullTitle = typeof title === 'string' ? `${title} | ${settings.siteName}` : title.absolute
  const url = `/${locale}${path}`

  return {
    title,
    description: desc,
    alternates: { canonical: url, languages: languageAlternates(path.split('?')[0]) },
    openGraph: {
      type,
      url,
      siteName: settings.siteName,
      title: fullTitle,
      description: desc,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: og ? [og] : undefined,
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: og ? 'summary_large_image' : 'summary',
      title: fullTitle,
      description: desc,
    },
  }
}
