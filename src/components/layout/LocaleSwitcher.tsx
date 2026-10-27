'use client'

import { useLocale, useTranslations } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'
import { locales } from '@/i18n/locales'

const labels: Record<string, string> = { th: 'TH', en: 'EN' }
const names: Record<string, string> = { th: 'ภาษาไทย', en: 'English' }

export function LocaleSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('Nav')

  return (
    <nav aria-label={t('switchLanguage')} className={`flex items-center rounded-full border border-line p-0.5 ${className}`}>
      {locales.map((code) => {
        const active = code === locale
        return (
          <Link
            key={code}
            href={pathname}
            locale={code}
            hrefLang={code}
            lang={code}
            aria-label={names[code]}
            aria-current={active ? 'true' : undefined}
            className={`min-w-10 rounded-full px-2.5 py-1 text-center text-sm font-semibold transition-colors ${
              active ? 'bg-brand-700 text-white' : 'text-muted hover:text-brand-700'
            }`}
          >
            {labels[code]}
          </Link>
        )
      })}
    </nav>
  )
}
