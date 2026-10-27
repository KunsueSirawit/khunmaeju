import type { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { routing } from '@/i18n/routing'
import { serverURL } from '@/lib/preview'
import '../globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(serverURL()),
  title: {
    default: 'คุณแม่จู้ของฝากเมืองภูเก็ต',
    template: '%s | คุณแม่จู้ภูเก็ต',
  },
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
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
