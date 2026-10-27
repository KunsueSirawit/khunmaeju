import { draftMode } from 'next/headers'
import type { Where } from 'payload'
import { cache } from 'react'

import type { Locale } from '@/i18n/locales'
import type { Post, PostCategory, Product, ProductCategory } from '@/payload-types'

import { payloadClient } from './payload'

export const PRODUCTS_PER_PAGE = 24
export const POSTS_PER_PAGE = 12

/**
 * Dev-only: USE_FIXTURES=true serves every page from src/fixtures instead of MongoDB,
 * so the front end can be built and reviewed without a database.
 */
const useFixtures = process.env.USE_FIXTURES === 'true' && process.env.NODE_ENV !== 'production'
const fixtures = async () => (await import('@/fixtures')).fixtures

/** Drafts are only shown to an editor who came in through /next/preview. */
export const isDraft = async () => (await draftMode()).isEnabled

// The Local API skips access control, so public queries must filter drafts out themselves.
const published: Where = { _status: { equals: 'published' } }
const publishedUnlessDraft = async (where?: Where): Promise<Where | undefined> => {
  if (await isDraft()) return where
  return where ? { and: [where, published] } : published
}

export type Paginated<T> = { docs: T[]; page: number; totalPages: number; totalDocs: number }

// --- Globals -----------------------------------------------------------------

export const getSiteSettings = cache(async (locale: Locale) => {
  if (useFixtures) return (await fixtures()).siteSettings(locale)
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'site-settings', locale, depth: 1 })
})

export const getHomePage = cache(async (locale: Locale) => {
  if (useFixtures) return (await fixtures()).homePage(locale)
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'home-page', locale, depth: 2, draft: await isDraft() })
})

export const getAboutPage = cache(async (locale: Locale) => {
  if (useFixtures) return (await fixtures()).aboutPage(locale)
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'about-page', locale, depth: 1, draft: await isDraft() })
})

export const getServicesPage = cache(async (locale: Locale) => {
  if (useFixtures) return (await fixtures()).servicesPage(locale)
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'services-page', locale, depth: 1, draft: await isDraft() })
})

export const getHowToOrderPage = cache(async (locale: Locale) => {
  if (useFixtures) return (await fixtures()).howToOrderPage(locale)
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'how-to-order-page', locale, depth: 1, draft: await isDraft() })
})

// --- Shop data ---------------------------------------------------------------

export const getProductCategories = cache(async (locale: Locale) => {
  if (useFixtures) return (await fixtures()).productCategories(locale)
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'product-categories', locale, sort: 'order', limit: 50, depth: 1 })
  return docs
})

export const getProductCategory = cache(async (locale: Locale, slug: string) => {
  const categories = await getProductCategories(locale)
  return categories.find((c) => c.slug === slug) ?? null
})

/** Products picked on the home page, or the newest "featured" ones when none are picked. */
export const getFeaturedProducts = async (locale: Locale, picked: (Product['id'] | Product)[] | null | undefined) => {
  const chosen = (picked ?? []).filter((p): p is Product => typeof p === 'object' && p !== null)
  if (chosen.length) return chosen.filter((p) => p._status === 'published')
  if (useFixtures) return (await fixtures()).products(locale).filter((p) => p.featured).slice(0, 10)

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    locale,
    where: { and: [{ featured: { equals: true } }, published] },
    sort: ['order', '-updatedAt'],
    limit: 10,
    depth: 1,
  })
  return docs
}

export const getProducts = cache(
  async (locale: Locale, page: number, categoryId?: ProductCategory['id']): Promise<Paginated<Product>> => {
    if (useFixtures) {
      const all = (await fixtures())
        .products(locale)
        .filter((p) => !categoryId || p.categories?.some((c) => (typeof c === 'object' ? c.id : c) === categoryId))
      return paginate(all, page, PRODUCTS_PER_PAGE)
    }
    const payload = await payloadClient()
    const result = await payload.find({
      collection: 'products',
      locale,
      where: { and: [published, ...(categoryId ? [{ categories: { in: [categoryId] } }] : [])] },
      sort: ['order', '-createdAt'],
      limit: PRODUCTS_PER_PAGE,
      page,
      depth: 1,
    })
    return { docs: result.docs, page: result.page ?? page, totalPages: result.totalPages, totalDocs: result.totalDocs }
  },
)

export const getProduct = cache(async (locale: Locale, slug: string) => {
  if (useFixtures) return (await fixtures()).products(locale).find((p) => p.slug === slug) ?? null
  const draft = await isDraft()
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    locale,
    where: await publishedUnlessDraft({ slug: { equals: slug } }),
    draft,
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
})

/** Hand-picked related products, else others from the same categories. */
export const getRelatedProducts = async (locale: Locale, product: Product, limit = 4): Promise<Product[]> => {
  const picked = (product.relatedProducts ?? []).filter(
    (p): p is Product => typeof p === 'object' && p !== null && p._status === 'published',
  )
  if (picked.length) return picked.slice(0, limit)

  const categoryIds = (product.categories ?? []).map((c) => (typeof c === 'object' ? c.id : c))
  if (!categoryIds.length) return []
  if (useFixtures) {
    return (await fixtures())
      .products(locale)
      .filter((p) => p.id !== product.id && p.categories?.some((c) => categoryIds.includes(typeof c === 'object' ? c.id : c)))
      .slice(0, limit)
  }
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    locale,
    where: { and: [published, { id: { not_equals: product.id } }, { categories: { in: categoryIds } }] },
    sort: 'order',
    limit,
    depth: 1,
  })
  return docs
}

// --- Store info ----------------------------------------------------------------

export const getBranches = cache(async (locale: Locale) => {
  if (useFixtures) return (await fixtures()).branches(locale)
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'branches', locale, sort: 'order', limit: 20, depth: 1 })
  return docs
})

export const getCertificates = cache(async (locale: Locale) => {
  if (useFixtures) return (await fixtures()).certificates(locale)
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'certificates', locale, sort: 'order', limit: 24, depth: 1 })
  return docs
})

// --- News --------------------------------------------------------------------

export const getPostCategories = cache(async (locale: Locale) => {
  if (useFixtures) return (await fixtures()).postCategories(locale)
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'post-categories', locale, sort: 'name', limit: 20 })
  return docs
})

export const getPosts = cache(
  async (locale: Locale, page: number, categoryId?: PostCategory['id'], limit = POSTS_PER_PAGE): Promise<Paginated<Post>> => {
    if (useFixtures) {
      const all = (await fixtures())
        .posts(locale)
        .filter((p) => !categoryId || (typeof p.category === 'object' ? p.category?.id : p.category) === categoryId)
      return paginate(all, page, limit)
    }
    const payload = await payloadClient()
    const result = await payload.find({
      collection: 'posts',
      locale,
      where: { and: [published, ...(categoryId ? [{ category: { equals: categoryId } }] : [])] },
      sort: '-publishedAt',
      limit,
      page,
      depth: 1,
    })
    return { docs: result.docs, page: result.page ?? page, totalPages: result.totalPages, totalDocs: result.totalDocs }
  },
)

export const getLatestPosts = async (locale: Locale, limit = 3) => (await getPosts(locale, 1, undefined, limit)).docs

export const getPost = cache(async (locale: Locale, slug: string) => {
  if (useFixtures) return (await fixtures()).posts(locale).find((p) => p.slug === slug) ?? null
  const draft = await isDraft()
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    locale,
    where: await publishedUnlessDraft({ slug: { equals: slug } }),
    draft,
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
})

function paginate<T>(all: T[], page: number, perPage: number): Paginated<T> {
  const totalPages = Math.max(1, Math.ceil(all.length / perPage))
  return { docs: all.slice((page - 1) * perPage, page * perPage), page, totalPages, totalDocs: all.length }
}

/** ?page=abc, ?page=-1 → 1 */
export const parsePage = (value: string | string[] | undefined): number => {
  const n = Number(Array.isArray(value) ? value[0] : value)
  return Number.isInteger(n) && n > 0 ? n : 1
}
