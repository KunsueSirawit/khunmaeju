import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/locales'
import { payloadClient } from '@/lib/payload'

// Temporary page for step 2: proves routing, localization and the database are wired up.
// Replaced by the real home page in step 3.
export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Common')
  const payload = await payloadClient()
  const home = await payload.findGlobal({ slug: 'home-page', locale })
  const { totalDocs } = await payload.count({ collection: 'products' })

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold">{home.hero?.title}</h1>
      <p className="mt-2 text-lg">{home.hero?.tagline}</p>
      <p className="mt-8 text-sm text-gray-500">
        {t('comingSoon')} · products: {totalDocs}
      </p>
    </main>
  )
}
