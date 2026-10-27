import type { Metadata, Viewport } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { routing } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/data'
import { serverURL } from '@/lib/preview'

import { bodyFont, headingFont } from '../fonts'
import '../globals.css'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  // Unknown locales (e.g. /favicon.ico) 404 in the layout; don't hit the database for them.
  const siteName = hasLocale(routing.locales, locale)
    ? (await getSiteSettings(locale)).siteName
    : 'คุณแม่จู้ของฝากเมืองภูเก็ต'
  return {
    metadataBase: new URL(serverURL()),
    title: { default: siteName, template: `%s | ${siteName}` },
    applicationName: siteName,
    // Staging/preview servers set NOINDEX=true so they never show up in search results.
    ...(process.env.NOINDEX === 'true' ? { robots: { index: false, follow: false } } : {}),
  }
}

export const viewport: Viewport = {
  themeColor: '#0c3b3a',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={locale} className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
