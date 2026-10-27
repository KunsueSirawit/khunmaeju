import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { SiteShell } from '@/components/layout/SiteShell'
import type { Locale } from '@/i18n/locales'
import { routing } from '@/i18n/routing'
import { getBranches, getProductCategories, getSiteSettings } from '@/lib/data'

export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: requested } = await params
  // Layouts render in parallel, so check here too: /favicon.ico must not hit the database.
  if (!hasLocale(routing.locales, requested)) notFound()
  const locale: Locale = requested
  const [settings, categories, branches] = await Promise.all([
    getSiteSettings(locale),
    getProductCategories(locale),
    getBranches(locale),
  ])

  return (
    <SiteShell settings={settings} categories={categories} mainBranch={branches[0]}>
      {children}
    </SiteShell>
  )
}
