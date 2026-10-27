import { asMedia } from '@/components/ui/MediaImage'
import type { Locale } from '@/i18n/locales'
import type { Branch, Post, Product, SiteSetting } from '@/payload-types'

import { absoluteURL, shareImage } from './seo'

const imageURL = (value: Parameters<typeof shareImage>[0]) => {
  const image = shareImage(value)
  return image ? absoluteURL(image.url) : undefined
}

const organizationRef = (settings: SiteSetting) => ({
  '@type': 'Organization',
  name: settings.siteName,
  url: absoluteURL('/'),
})

/** Home page: who we are, how to reach us, and our social profiles. */
export const organizationSchema = (settings: SiteSetting, locale: Locale, branches: Branch[]) => ({
  '@type': 'Organization',
  '@id': absoluteURL('/#organization'),
  name: settings.siteName,
  url: absoluteURL(`/${locale}`),
  logo: imageURL(settings.logo),
  description: settings.defaultMetaDescription || undefined,
  telephone: settings.phone || undefined,
  email: settings.email || undefined,
  address: settings.address || undefined,
  sameAs: [settings.facebookUrl, settings.instagramUrl, settings.lineUrl].filter(Boolean),
  location: branches.map((b) => ({
    '@type': 'Place',
    name: b.name,
    address: b.address || undefined,
    telephone: b.phone || undefined,
  })),
})

/**
 * Product page. Offers are only listed when there is a price; "ask for price" products
 * stay valid structured data without one.
 */
export const productSchema = (product: Product, settings: SiteSetting, locale: Locale) => {
  const url = absoluteURL(`/${locale}/products/${product.slug}`)
  const onSale = product.salePrice != null && product.price != null && product.salePrice < product.price
  const price = onSale ? product.salePrice : product.price
  return {
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || undefined,
    sku: product.sku || undefined,
    image: (product.images ?? []).map((m) => imageURL(asMedia(m))).filter(Boolean),
    brand: { '@type': 'Brand', name: settings.siteName },
    url,
    ...(price != null
      ? {
          offers: {
            '@type': 'Offer',
            price: price.toFixed(2),
            priceCurrency: 'THB',
            availability: 'https://schema.org/InStock',
            url,
            seller: organizationRef(settings),
          },
        }
      : {}),
  }
}

/** News/promotion detail page. */
export const articleSchema = (post: Post, settings: SiteSetting, locale: Locale) => ({
  '@type': 'NewsArticle',
  headline: post.title,
  description: post.excerpt || undefined,
  image: [imageURL(post.cover)].filter(Boolean),
  datePublished: post.publishedAt || post.createdAt,
  dateModified: post.updatedAt,
  mainEntityOfPage: absoluteURL(`/${locale}/news/${post.slug}`),
  author: organizationRef(settings),
  publisher: { ...organizationRef(settings), logo: imageURL(settings.logo) },
})
