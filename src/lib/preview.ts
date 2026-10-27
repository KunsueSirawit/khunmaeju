export const serverURL = (): string =>
  process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') || 'http://localhost:3000'

const sectionPath = {
  products: 'products',
  posts: 'news',
} as const

export type PreviewCollection = keyof typeof sectionPath

/** Front-end path of a document, e.g. /th/products/crispy-shrimp */
export const documentPath = (collection: PreviewCollection, slug: string, locale = 'th'): string =>
  `/${locale}/${sectionPath[collection]}/${slug}`

/**
 * URL used by the admin "Preview" button and Live Preview iframe. It goes through
 * /next/preview, which checks the editor is logged in and turns on Next.js draft mode.
 */
export const previewURL = (
  collection: PreviewCollection,
  slug: string | null | undefined,
  locale?: string | null,
): string => {
  if (!slug) return ''
  const path = documentPath(collection, slug, locale || 'th')
  return `${serverURL()}/next/preview?path=${encodeURIComponent(path)}`
}
