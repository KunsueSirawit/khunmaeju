import { draftMode } from 'next/headers'
import { cache } from 'react'

import type { Locale } from '@/i18n/locales'
import type { Product } from '@/payload-types'

import { payloadClient } from './payload'

/** Drafts are only shown to an editor who came in through /next/preview. */
const isDraft = async () => (await draftMode()).isEnabled

// The Local API skips access control, so public queries must filter drafts out themselves.
const publishedOnly = { _status: { equals: 'published' } } as const

export const getSiteSettings = cache(async (locale: Locale) => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'site-settings', locale, depth: 1 })
})

export const getHomePage = cache(async (locale: Locale) => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'home-page', locale, depth: 2, draft: await isDraft() })
})

export const getProductCategories = cache(async (locale: Locale) => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'product-categories',
    locale,
    sort: 'order',
    limit: 50,
    depth: 1,
  })
  return docs
})

/** Products picked on the home page, or the newest "featured" ones when none are picked. */
export const getFeaturedProducts = async (locale: Locale, picked: (number | Product)[] | null | undefined) => {
  const chosen = (picked ?? []).filter((p): p is Product => typeof p === 'object' && p !== null)
  if (chosen.length) return chosen.filter((p) => p._status === 'published')

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    locale,
    where: { and: [{ featured: { equals: true } }, publishedOnly] },
    sort: ['order', '-updatedAt'],
    limit: 10,
    depth: 1,
  })
  return docs
}

export const getBranches = cache(async (locale: Locale) => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'branches', locale, sort: 'order', limit: 20, depth: 1 })
  return docs
})

export const getCertificates = cache(async (locale: Locale) => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'certificates', locale, sort: 'order', limit: 24, depth: 1 })
  return docs
})

export const getLatestPosts = cache(async (locale: Locale, limit = 3) => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    locale,
    where: publishedOnly,
    sort: '-publishedAt',
    limit,
    depth: 1,
  })
  return docs
})
