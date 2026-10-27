import type { MetadataRoute } from 'next'

import { absoluteURL } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  // Staging/preview servers: keep everything out of search engines.
  if (process.env.NOINDEX === 'true') return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/next/', '/*/styleguide'],
    },
    sitemap: absoluteURL('/sitemap.xml'),
  }
}
