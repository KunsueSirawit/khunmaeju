import { defineRouting } from 'next-intl/routing'

import { defaultLocale, locales } from './locales'

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always /th/... and /en/... so every page has one canonical URL per language.
  localePrefix: 'always',
})
