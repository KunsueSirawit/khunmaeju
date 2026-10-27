import { setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/locales'

export type LocaleParams<T = object> = { params: Promise<{ locale: string } & T> }

/** Reads the [locale] segment (already validated by the layout) and enables static rendering for it. */
export async function resolveLocale<T>(params: LocaleParams<T>['params']) {
  const resolved = await params
  const locale = resolved.locale as Locale
  setRequestLocale(locale)
  return { ...resolved, locale }
}
